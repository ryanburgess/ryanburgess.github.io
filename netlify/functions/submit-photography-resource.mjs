import { createHash } from "node:crypto";
import categoriesSnapshot from "../../src/data/photography-resources/categories.json" with { type: "json" };
import {
  createResourceId,
  findDuplicateResource,
  generatePhotographyResourcesReadme,
  validateResourceCollection,
  validateResourceSubmission,
} from "../../shared/photography-resources-contract.js";

const API_VERSION = "2026-03-10";
const DEFAULT_REPOSITORY = "ryanburgess/photography-resources";
const CATEGORY_PATH = "categories.json";
const RESOURCE_PATH = "resources.json";
const README_PATH = "README.md";
const BRANCH_PREFIX = "resource-submission/";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function parseRepository(value) {
  const match = String(value || DEFAULT_REPOSITORY).match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (!match) throw new Error("The photography resources repository configuration is invalid.");
  return { owner: match[1], repo: match[2] };
}

function decodeContent(value) {
  return Buffer.from(String(value || "").replace(/\n/g, ""), "base64").toString("utf8");
}

function encodeContent(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

function escapePullRequestText(value) {
  return String(value || "").replace(/([`*_{}()<>#+.!|~-]|\[|\])/g, "\\$1");
}

function makeBranchName(idempotencyKey) {
  const digest = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 20);
  return `${BRANCH_PREFIX}${digest}`;
}

function categoryItems(data) {
  return Array.isArray(data) ? data : data?.categories || [];
}

function resourceItems(data) {
  return Array.isArray(data) ? data : data?.resources || [];
}

async function verifyTurnstile({ secret, token, ip, fetchImpl }) {
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

function createGithubClient({ token, owner, repo, fetchImpl }) {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "ryanburgess-photography-resources",
  };

  async function request(path, options = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...options,
      headers: { ...headers, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
    });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(body?.message || `GitHub request failed (${response.status}).`);
      error.status = response.status;
      error.details = body;
      throw error;
    }
    return body;
  }

  return {
    request,
    getFile: (path, ref) => request(`/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`),
    putFile: (path, payload) => request(`/contents/${encodeURIComponent(path)}`, { method: "PUT", body: JSON.stringify(payload) }),
  };
}

async function findPendingDuplicate(github, normalizedUrl) {
  const pulls = await github.request("/pulls?state=open&per_page=50&sort=created&direction=desc");
  for (const pull of pulls) {
    if (!pull.head?.ref?.startsWith(BRANCH_PREFIX)) continue;
    try {
      const file = await github.getFile(RESOURCE_PATH, pull.head.sha);
      const pending = JSON.parse(decodeContent(file.content));
      if (findDuplicateResource(pending.resources, normalizedUrl)) return pull;
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  return null;
}

async function findPullForBranch(github, branchName) {
  const pulls = await github.request("/pulls?state=all&per_page=50&sort=created&direction=desc");
  return pulls.find((pull) => pull.head?.ref === branchName) || null;
}

export function createSubmissionHandler({ fetchImpl = fetch, env = process.env } = {}) {
  return async function handler(request) {
    if (request.method !== "POST") return json(405, { message: "Method not allowed." });
    if (env.PHOTOGRAPHY_SUBMISSIONS_ENABLED !== "true") {
      return json(503, { message: "Resource submissions are not configured yet. Please check back soon." });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20_000) return json(413, { message: "Submission is too large." });

    const idempotencyKey = request.headers.get("idempotency-key") || "";
    if (!/^[A-Za-z0-9-]{16,128}$/.test(idempotencyKey)) {
      return json(400, { message: "A valid idempotency key is required." });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json(400, { message: "Invalid JSON payload." });
    }

    if (String(payload.website || "").trim()) {
      return json(202, { message: "Thanks—your resource is awaiting review." });
    }

    const validation = validateResourceSubmission(payload, categoriesSnapshot.categories);
    if (!validation.valid) return json(422, { message: "Please correct the highlighted fields.", errors: validation.errors });

    const challengeIsValid = await verifyTurnstile({
      secret: env.TURNSTILE_SECRET_KEY,
      token: payload.turnstileToken,
      ip: request.headers.get("x-nf-client-connection-ip"),
      fetchImpl,
    });
    if (!challengeIsValid) return json(422, { message: "Please complete the anti-spam check and try again." });

    if (!env.GITHUB_TOKEN) return json(503, { message: "Resource submissions are not configured yet." });

    try {
      const { owner, repo } = parseRepository(env.PHOTOGRAPHY_RESOURCES_REPOSITORY);
      const github = createGithubClient({ token: env.GITHUB_TOKEN, owner, repo, fetchImpl });
      const branchName = makeBranchName(idempotencyKey);
      const existingPull = await findPullForBranch(github, branchName);
      if (existingPull) return json(200, { prUrl: existingPull.html_url, awaitingReview: true, idempotent: true });

      const repository = await github.request("");
      const baseBranch = repository.default_branch;
      const [baseRef, categoryFile, resourceFile] = await Promise.all([
        github.request(`/git/ref/heads/${encodeURIComponent(baseBranch)}`),
        github.getFile(CATEGORY_PATH, baseBranch),
        github.getFile(RESOURCE_PATH, baseBranch),
      ]);
      const categories = categoryItems(JSON.parse(decodeContent(categoryFile.content)));
      const approvedResources = resourceItems(JSON.parse(decodeContent(resourceFile.content)));
      const serverValidation = validateResourceSubmission(validation.value, categories);
      if (!serverValidation.valid) return json(422, { message: "Please correct the highlighted fields.", errors: serverValidation.errors });

      const approvedDuplicate = findDuplicateResource(approvedResources, serverValidation.value.url);
      if (approvedDuplicate) return json(409, { message: "This URL is already in the approved collection.", errors: { url: "This URL is already approved." } });

      const pendingDuplicate = await findPendingDuplicate(github, serverValidation.value.url);
      if (pendingDuplicate) return json(409, { message: "This URL is already awaiting review.", prUrl: pendingDuplicate.html_url, errors: { url: "This URL is already awaiting review." } });

      try {
        await github.request("/git/refs", {
          method: "POST",
          body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseRef.object.sha }),
        });
      } catch (error) {
        if (error.status !== 422) throw error;
      }

      const branchResourceFile = await github.getFile(RESOURCE_PATH, branchName);
      const nextResources = resourceItems(JSON.parse(decodeContent(branchResourceFile.content)));
      if (!findDuplicateResource(nextResources, serverValidation.value.url)) {
        nextResources.push({
          id: createResourceId(serverValidation.value.title, serverValidation.value.url),
          ...serverValidation.value,
        });
      }
      nextResources.sort((a, b) => a.title.localeCompare(b.title));
      const collectionValidation = validateResourceCollection({ version: 1, resources: nextResources }, categories);
      if (!collectionValidation.valid) throw new Error(`Generated collection is invalid: ${collectionValidation.errors.join(" ")}`);

      await github.putFile(RESOURCE_PATH, {
        message: `Add resource: ${serverValidation.value.title}`,
        content: encodeContent(`${JSON.stringify(nextResources, null, 2)}\n`),
        branch: branchName,
        sha: branchResourceFile.sha,
      });

      let readmeFile = null;
      try {
        readmeFile = await github.getFile(README_PATH, branchName);
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      await github.putFile(README_PATH, {
        message: "Regenerate photography resources README",
        content: encodeContent(generatePhotographyResourcesReadme({ categories, resources: nextResources })),
        branch: branchName,
        ...(readmeFile?.sha ? { sha: readmeFile.sha } : {}),
      });

      const pull = await github.request("/pulls", {
        method: "POST",
        body: JSON.stringify({
          title: `Add photography resource: ${serverValidation.value.title}`,
          head: branchName,
          base: baseBranch,
          body: `## Submitted resource\n\n- **Category:** ${escapePullRequestText(serverValidation.value.category)}\n- **Title:** ${escapePullRequestText(serverValidation.value.title)}\n- **URL:** ${escapePullRequestText(serverValidation.value.url)}\n\nThis public submission is awaiting editorial review.`,
          maintainer_can_modify: true,
        }),
      });

      return json(201, { prUrl: pull.html_url, awaitingReview: true });
    } catch (error) {
      console.error("Photography resource submission failed", { status: error.status || 500, name: error.name || "Error" });
      return json(502, { message: "The review request could not be created. Your resource was not published. Please try again." });
    }
  };
}

export default createSubmissionHandler();

export const config = {
  path: "/api/resources/submit",
  rateLimit: {
    windowLimit: 5,
    windowSize: 3600,
    aggregateBy: ["ip", "domain"],
  },
};

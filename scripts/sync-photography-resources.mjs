import { writeFile } from "node:fs/promises";
import { validateResourceCollection } from "../shared/photography-resources-contract.js";

const repository = process.env.PHOTOGRAPHY_RESOURCES_SOURCE_REPOSITORY;
const requestedRef = process.env.PHOTOGRAPHY_RESOURCES_SOURCE_REF || "main";

if (!repository) {
  console.log("Using the bundled photography resource snapshot (no source repository configured)." );
  process.exit(0);
}

if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
  throw new Error("PHOTOGRAPHY_RESOURCES_SOURCE_REPOSITORY must be owner/repository.");
}

const headers = {
  Accept: "application/vnd.github.raw+json",
  "X-GitHub-Api-Version": "2026-03-10",
  "User-Agent": "ryanburgess-photography-resources-build",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};
const apiBase = `https://api.github.com/repos/${repository}`;

const commitResponse = await fetch(`${apiBase}/commits/${encodeURIComponent(requestedRef)}`, { headers: { ...headers, Accept: "application/vnd.github+json" } });
if (!commitResponse.ok) throw new Error(`Unable to resolve photography resource source ref (${commitResponse.status}).`);
const commit = await commitResponse.json();
const commitSha = commit.sha;

async function fetchFile(path) {
  const response = await fetch(`${apiBase}/contents/${path}?ref=${encodeURIComponent(commitSha)}`, { headers });
  if (!response.ok) throw new Error(`Unable to fetch ${path} at ${commitSha} (${response.status}).`);
  return response.json();
}

const [categorySource, resourceSource] = await Promise.all([fetchFile("categories.json"), fetchFile("resources.json")]);
const categories = Array.isArray(categorySource) ? categorySource : categorySource.categories;
const resourceItems = Array.isArray(resourceSource) ? resourceSource : resourceSource.resources;
const resources = { version: 1, sourceCommit: commitSha, resources: resourceItems };
const validation = validateResourceCollection(resources, categories);
if (!validation.valid) throw new Error(`Fetched photography resources are invalid:\n- ${validation.errors.join("\n- ")}`);

const dataDirectory = new URL("../src/data/photography-resources/", import.meta.url);
await Promise.all([
  writeFile(new URL("categories.json", dataDirectory), `${JSON.stringify({ version: 1, categories }, null, 2)}\n`),
  writeFile(new URL("resources.json", dataDirectory), `${JSON.stringify(resources, null, 2)}\n`),
]);
console.log(`Bundled ${resources.resources.length} photography resources from ${repository}@${commitSha}.`);

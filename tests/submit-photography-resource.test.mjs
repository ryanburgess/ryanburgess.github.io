import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createSubmissionHandler } from "../netlify/functions/submit-photography-resource.mjs";

const payload = { category: "books", title: "Useful Guide", url: "https://example.com/guide", notes: "Helpful notes.", website: "" };
const key = "12345678-1234-1234-1234-123456789012";

function request(body = payload, headers = {}) {
  return new Request("https://example.com/api/resources/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": key, ...headers },
    body: JSON.stringify(body),
  });
}

test("keeps submissions disabled until production is configured", async () => {
  const response = await createSubmissionHandler({ env: {} })(request());
  assert.equal(response.status, 503);
});

test("returns inline validation errors before contacting GitHub", async () => {
  let calls = 0;
  const response = await createSubmissionHandler({ env: { PHOTOGRAPHY_SUBMISSIONS_ENABLED: "true" }, fetchImpl: async () => { calls += 1; } })(request({ ...payload, url: "file:///tmp/private" }));
  assert.equal(response.status, 422);
  assert.equal(calls, 0);
});

test("silently accepts honeypot submissions", async () => {
  const response = await createSubmissionHandler({ env: { PHOTOGRAPHY_SUBMISSIONS_ENABLED: "true" } })(request({ ...payload, website: "spam" }));
  assert.equal(response.status, 202);
});

test("returns the existing pull request for an idempotent retry", async () => {
  const branch = `resource-submission/${createHash("sha256").update(key).digest("hex").slice(0, 20)}`;
  const fetchImpl = async (url) => {
    assert.match(url, /\/pulls\?state=all/);
    return Response.json([{ html_url: "https://github.com/ryanburgess/photography-resources/pull/12", head: { ref: branch } }]);
  };
  const handler = createSubmissionHandler({
    env: { PHOTOGRAPHY_SUBMISSIONS_ENABLED: "true", GITHUB_TOKEN: "test-token" },
    fetchImpl,
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).idempotent, true);
});

test("does not expose GitHub errors", async () => {
  const fetchImpl = async () => Response.json({ message: "secret upstream detail" }, { status: 500 });
  const handler = createSubmissionHandler({
    env: { PHOTOGRAPHY_SUBMISSIONS_ENABLED: "true", GITHUB_TOKEN: "test-token" },
    fetchImpl,
  });
  const response = await handler(request());
  assert.equal(response.status, 502);
  assert.doesNotMatch((await response.json()).message, /secret upstream detail/);
});

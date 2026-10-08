import test from "node:test";
import assert from "node:assert/strict";
import categoriesData from "../src/data/photography-resources/categories.json" with { type: "json" };
import {
  createResourceId,
  findDuplicateResource,
  generatePhotographyResourcesReadme,
  normalizeResourceUrl,
  validateResourceCollection,
  validateResourceInput,
  validateResourceSubmission,
} from "../shared/photography-resources-contract.js";

const categories = categoriesData.categories;
const validInput = { category: categories[0].id, title: "Useful Camera Guide", url: "https://Example.com/Guide?ref=one", notes: "A concise reference." };

test("trims and validates a resource", () => {
  const result = validateResourceInput({ ...validInput, title: "  Useful Camera Guide  " }, categories);
  assert.equal(result.valid, true);
  assert.equal(result.value.title, "Useful Camera Guide");
  assert.equal(result.value.url, "https://example.com/Guide?ref=one");
});

test("rejects blank, unknown, and unsafe inputs", () => {
  assert.equal(validateResourceInput({ category: "", title: " ", url: "javascript:alert(1)" }, categories).valid, false);
  assert.equal(validateResourceInput({ ...validInput, category: "unknown" }, categories).errors.category, "Choose a recognized category.");
  assert.equal(validateResourceInput({ ...validInput, title: "Unsafe\nheading" }, categories).errors.title, "Title contains unsupported characters.");
});

test("requires a five-word recommendation for submissions", () => {
  assert.equal(validateResourceSubmission({ ...validInput, notes: "Too few words here" }, categories).valid, false);
  assert.equal(validateResourceSubmission({ ...validInput, notes: "This resource offers clear practical guidance" }, categories).valid, true);
});

test("URL normalization preserves path case and meaningful query parameters", () => {
  assert.equal(normalizeResourceUrl("HTTPS://EXAMPLE.COM/Photo?Size=Large#top"), "https://example.com/Photo?Size=Large");
});

test("detects duplicate normalized URLs", () => {
  const duplicate = findDuplicateResource([{ ...validInput, id: "one" }], "https://example.com/Guide?ref=one#section");
  assert.equal(duplicate.id, "one");
});

test("generates stable ids and escaped Markdown", () => {
  assert.equal(createResourceId(validInput.title, validInput.url), createResourceId(validInput.title, validInput.url));
  const readme = generatePhotographyResourcesReadme({ categories, resources: [{ ...validInput, id: "one", title: "Guide [one]", notes: "Useful *now*" }] });
  assert.match(readme, /Guide \\\[one\\\]/);
  assert.match(readme, /Useful \\[*]now\\[*]/);
});

test("collection validation rejects duplicate URLs", () => {
  const resource = { ...validInput, id: "one" };
  const result = validateResourceCollection({ version: 1, resources: [resource, { ...resource, id: "two" }] }, categories);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("duplicate URL")));
});

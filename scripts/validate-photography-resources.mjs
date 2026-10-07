import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { validateResourceCollection } from "../shared/photography-resources-contract.js";

const dataDirectory = new URL("../src/data/photography-resources/", import.meta.url);
const categories = JSON.parse(await readFile(new URL("categories.json", dataDirectory), "utf8"));
const resources = JSON.parse(await readFile(new URL("resources.json", dataDirectory), "utf8"));

if (!Array.isArray(categories.categories) || categories.categories.length === 0) {
  throw new Error("Photography resource categories are missing.");
}

const ids = new Set();
for (const category of categories.categories) {
  if (!category.id || !category.label) throw new Error("Every photography resource category needs an id and label.");
  if (ids.has(category.id)) throw new Error(`Duplicate photography resource category: ${category.id}`);
  ids.add(category.id);
}

const result = validateResourceCollection(resources, categories.categories);
if (!result.valid) throw new Error(`Photography resource data is invalid:\n- ${result.errors.join("\n- ")}`);

console.log(`Validated ${resources.resources.length} photography resources from ${fileURLToPath(dataDirectory)}.`);

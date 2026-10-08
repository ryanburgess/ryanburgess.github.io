import categoriesData from "../data/photography-resources/categories.json";
import resourcesData from "../data/photography-resources/resources.json";
import {
  findDuplicateResource,
  normalizeResourceUrl,
  validateResourceCollection,
  validateResourceSubmission,
} from "../../shared/photography-resources-contract";

const PHOTOGRAPHY_RESOURCES_SOURCE = "https://raw.githubusercontent.com/ryanburgess/photography-resources/main";

export const photographyResourceCategories = categoriesData.categories;
export const approvedPhotographyResources = resourcesData.resources;
export const photographyResourcesSourceCommit = resourcesData.sourceCommit;

export async function fetchPhotographyResources({ signal } = {}) {
  const [categoriesResponse, resourcesResponse] = await Promise.all([
    fetch(`${PHOTOGRAPHY_RESOURCES_SOURCE}/categories.json`, { cache: "no-store", signal }),
    fetch(`${PHOTOGRAPHY_RESOURCES_SOURCE}/resources.json`, { cache: "no-store", signal }),
  ]);

  if (!categoriesResponse.ok || !resourcesResponse.ok) {
    throw new Error("The live photography resources could not be loaded.");
  }

  const [categorySource, resourceSource] = await Promise.all([
    categoriesResponse.json(),
    resourcesResponse.json(),
  ]);
  const categories = Array.isArray(categorySource) ? categorySource : categorySource.categories;
  const resources = Array.isArray(resourceSource) ? resourceSource : resourceSource.resources;
  const validation = validateResourceCollection({ version: 1, resources }, categories);

  if (!validation.valid) {
    throw new Error(`The live photography resource data is invalid: ${validation.errors.join(" ")}`);
  }

  return { categories, resources };
}

export function validatePhotographyResource(input, categories = photographyResourceCategories) {
  return validateResourceSubmission(input, categories);
}

export function findApprovedDuplicate(url, resources = approvedPhotographyResources) {
  return findDuplicateResource(resources, url);
}

export { normalizeResourceUrl };

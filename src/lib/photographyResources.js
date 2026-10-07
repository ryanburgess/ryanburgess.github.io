import categoriesData from "../data/photography-resources/categories.json";
import resourcesData from "../data/photography-resources/resources.json";
import {
  findDuplicateResource,
  normalizeResourceUrl,
  validateResourceInput,
} from "../../shared/photography-resources-contract";

export const photographyResourceCategories = categoriesData.categories;
export const approvedPhotographyResources = resourcesData.resources;
export const photographyResourcesSourceCommit = resourcesData.sourceCommit;

export function validatePhotographyResource(input) {
  return validateResourceInput(input, photographyResourceCategories);
}

export function findApprovedDuplicate(url) {
  return findDuplicateResource(approvedPhotographyResources, url);
}

export { normalizeResourceUrl };

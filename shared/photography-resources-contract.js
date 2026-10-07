export const PHOTOGRAPHY_RESOURCES_CONTRACT_VERSION = 1;

export const RESOURCE_LIMITS = Object.freeze({
  category: 64,
  title: 120,
  url: 2048,
  notes: 500,
});

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeResourceUrl(value) {
  const input = cleanString(value);
  if (!input) return "";

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return "";
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
  parsed.hash = "";
  return parsed.href;
}

export function validateResourceInput(input, categories) {
  const allowedCategories = new Set((categories || []).map((category) => category.id));
  const value = {
    category: cleanString(input?.category),
    title: cleanString(input?.title),
    url: cleanString(input?.url),
    notes: cleanString(input?.notes),
  };
  const errors = {};

  if (!value.category) errors.category = "Choose a category.";
  else if (value.category.length > RESOURCE_LIMITS.category) errors.category = "Category is too long.";
  else if (!allowedCategories.has(value.category)) errors.category = "Choose a recognized category.";

  if (!value.title) errors.title = "Enter a title.";
  else if (value.title.length > RESOURCE_LIMITS.title) errors.title = `Use ${RESOURCE_LIMITS.title} characters or fewer.`;
  else if ([...value.title].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) errors.title = "Title contains unsupported characters.";

  if (!value.url) errors.url = "Enter a URL.";
  else if (value.url.length > RESOURCE_LIMITS.url) errors.url = "URL is too long.";
  else if (!normalizeResourceUrl(value.url)) errors.url = "Enter a valid http:// or https:// URL.";

  if (value.notes.length > RESOURCE_LIMITS.notes) errors.notes = `Use ${RESOURCE_LIMITS.notes} characters or fewer.`;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: { ...value, url: normalizeResourceUrl(value.url) || value.url },
  };
}

export function findDuplicateResource(resources, url) {
  const normalized = normalizeResourceUrl(url);
  if (!normalized) return null;
  return (resources || []).find((resource) => normalizeResourceUrl(resource.url) === normalized) || null;
}

export function createResourceId(title, url) {
  const slug = cleanString(title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "resource";
  let hash = 2166136261;
  for (const character of normalizeResourceUrl(url)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const suffix = (hash >>> 0).toString(16).padStart(8, "0");
  return `${slug}-${suffix}`;
}

function escapeMarkdown(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/([`*_{}()<>#+.!|~-]|\[|\])/g, "\\$1")
    .replace(/[\r\n]+/g, " ");
}

export function generatePhotographyResourcesReadme({ categories, resources }) {
  const byCategory = new Map((categories || []).map((category) => [category.id, []]));
  for (const resource of resources || []) {
    if (byCategory.has(resource.category)) byCategory.get(resource.category).push(resource);
  }

  const sections = (categories || []).map((category) => {
    const items = byCategory.get(category.id) || [];
    const lines = items.length
      ? items
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((resource) => {
            const note = resource.notes ? ` — ${escapeMarkdown(resource.notes)}` : "";
            return `- [${escapeMarkdown(resource.title)}](${resource.url})${note}`;
          })
      : ["_No approved resources yet._"];
    return `## ${escapeMarkdown(category.label)}\n\n${lines.join("\n")}`;
  });

  return `# Photography Resources\n\nA community-curated collection of useful photography links. Every addition is reviewed before publication.\n\n${sections.join("\n\n")}\n\n## Contributing\n\nRun \`npm run add\` in this repository or submit a link through the photography website. Contributions are reviewed through pull requests.\n`;
}

export function validateResourceCollection(data, categories) {
  const errors = [];
  const seenIds = new Set();
  const seenUrls = new Set();

  if (data?.version !== PHOTOGRAPHY_RESOURCES_CONTRACT_VERSION) errors.push("Unsupported resource contract version.");
  if (!Array.isArray(data?.resources)) return { valid: false, errors: [...errors, "Resources must be an array."] };

  for (const [index, resource] of data.resources.entries()) {
    const result = validateResourceInput(resource, categories);
    for (const message of Object.values(result.errors)) errors.push(`Resource ${index + 1}: ${message}`);
    if (!resource.id) errors.push(`Resource ${index + 1}: missing stable id.`);
    else if (seenIds.has(resource.id)) errors.push(`Resource ${index + 1}: duplicate id.`);
    else seenIds.add(resource.id);

    const normalized = normalizeResourceUrl(resource.url);
    if (normalized && seenUrls.has(normalized)) errors.push(`Resource ${index + 1}: duplicate URL.`);
    else if (normalized) seenUrls.add(normalized);
  }

  return { valid: errors.length === 0, errors };
}

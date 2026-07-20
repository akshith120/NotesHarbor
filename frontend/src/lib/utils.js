export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function normalizeTag(tag) {
  if (typeof tag !== "string") {
    return "";
  }

  return tag.trim().toLowerCase();
}

export function normalizeTags(tags) {
  return [...new Set(tags.map(normalizeTag).filter(Boolean))];
}

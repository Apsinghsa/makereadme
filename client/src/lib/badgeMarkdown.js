export function getBadgeMarkdown(badge) {
  const label = badge.labelText || badge.label.replace(/ /g, '_');
  const message = badge.message || badge.label.replace(/ /g, '_');
  if (badge.static) {
    return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${badge.color})`;
  }
  const logoParam = badge.logo ? `&logo=${badge.logo}&logoColor=${badge.logoColor}` : '';
  return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(badge.label.replace(/ /g, '_'))}-${badge.color}?style=flat-square${logoParam})`;
}

export function getCustomBadgeMarkdown(label, message, color) {
  if (!label || !message || !color) return null;
  return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color})`;
}

export function extractBadgeUrl(badgeMarkdown) {
  const match = badgeMarkdown.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
}

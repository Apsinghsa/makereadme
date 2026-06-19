export function getBadgeMarkdown(badge) {
  const label = badge.labelText || badge.label.replace(/ /g, '_');
  const message = badge.message || badge.label.replace(/ /g, '_');
  if (badge.static) {
    return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${badge.color})`;
  }
  const logoParam = badge.logo ? `&logo=${badge.logo}&logoColor=${badge.logoColor}` : '';
  return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(badge.label.replace(/ /g, '_'))}-${badge.color}?style=flat-square${logoParam})`;
}

/**
 * Parses "https://github.com/owner/repo" → { owner, repo } or null.
 */
export function parseGitHubUrl(repoUrl) {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.replace(/^\//, '').split('/');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
    }
  } catch {
    // Ignore invalid URL parsing
  }
  return null;
}

/**
 * Builds a live shields.io/github badge URL for a badge with { github: true, path }.
 * If repoUrl is missing or unparseable, returns a placeholder badge URL.
 */
export function getGitHubBadgeMarkdown(badge, repoUrl) {
  const parsed = repoUrl ? parseGitHubUrl(repoUrl) : null;
  if (!parsed) {
    // No repo URL yet — return a placeholder so the button still shows something
    return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(badge.label)}-unavailable-lightgrey)`;
  }
  const { owner, repo } = parsed;
  const styleParam = badge.style ? `?style=${badge.style}` : '';
  return `![${badge.label}](https://img.shields.io/github/${badge.path}/${owner}/${repo}${styleParam})`;
}

export function getCustomBadgeMarkdown(label, message, color) {
  if (!label || !message || !color) return null;
  return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color})`;
}

export function extractBadgeUrl(badgeMarkdown) {
  const match = badgeMarkdown.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
}

export function insertBadgeAfterHeading(content, badgeMd) {
  if (!content) {
    return `<p align="center">\n\n${badgeMd}\n\n</p>\n`;
  }

  const lines = content.split('\n');
  const h1idx = lines.findIndex((l) => l.startsWith('# '));

  if (h1idx !== -1) {
    // Find if there's a center block right after title
    let centerStart = -1;
    let centerEnd = -1;
    for (let i = h1idx + 1; i < Math.min(h1idx + 10, lines.length); i++) {
      if (lines[i].startsWith('<p align="center">')) centerStart = i;
      if (centerStart !== -1 && lines[i].startsWith('</p>')) {
        centerEnd = i;
        break;
      }
    }
    if (centerStart !== -1 && centerEnd !== -1) {
      // Insert badge before </p>, with blank line separation
      lines.splice(centerEnd, 0, '', badgeMd);
    } else {
      // Create new center block after title with blank lines for GitHub markdown
      lines.splice(h1idx + 1, 0, '', '<p align="center">', '', badgeMd, '', '</p>', '');
    }
    return lines.join('\n');
  }

  return `<p align="center">\n\n${badgeMd}\n\n</p>\n\n${content}`;
}

export function countLines(content) {
  return content ? content.split('\n').length : 0;
}

export function countActiveSections(selectedSections) {
  return selectedSections.length;
}

/**
 * Insert a badge into the markdown after the first heading block.
 *
 * Badges are placed inside a single <p align="center"> block that lives
 * immediately after the title/subheading. Multiple badges share that one block,
 * separated by a single space — no blank lines between them — so GitHub renders
 * them as a horizontal row rather than stacking them vertically.
 */
export function insertBadgeAfterHeading(content, badgeMd) {
  if (!content) {
    return `<p align="center">\n${badgeMd}\n</p>\n`;
  }

  const lines = content.split('\n');

  // Find the first heading — support both <h1 align="center"> and # Markdown headings
  const h1idx = lines.findIndex(
    (l) => l.startsWith('<h1') || l.startsWith('# ')
  );

  if (h1idx !== -1) {
    // Look for an existing <p align="center"> badge block within the next 15 lines
    let centerStart = -1;
    let centerEnd = -1;
    const searchLimit = Math.min(h1idx + 15, lines.length);

    for (let i = h1idx + 1; i < searchLimit; i++) {
      if (lines[i].startsWith('<p align="center">') || lines[i] === '<p align="center">') {
        centerStart = i;
      }
      if (centerStart !== -1 && lines[i].startsWith('</p>')) {
        centerEnd = i;
        break;
      }
    }

    if (centerStart !== -1 && centerEnd !== -1) {
      // Append the new badge to the line just before </p>, separated by a space.
      // Find the last non-empty badge line inside the block.
      let insertAt = centerEnd; // default: insert right before </p>
      for (let i = centerEnd - 1; i > centerStart; i--) {
        if (lines[i].trim() !== '') {
          // Append badge to this line (same line = side-by-side in GitHub)
          lines[i] = lines[i] + ' ' + badgeMd;
          return lines.join('\n');
        }
      }
      // Block is empty — insert a badge line before </p>
      lines.splice(insertAt, 0, badgeMd);
      return lines.join('\n');
    } else {
      // No existing badge block — create one right after the heading / subheading block.
      // Skip past any <h3> line that immediately follows the <h1>.
      let insertAfter = h1idx;
      if (
        h1idx + 1 < lines.length &&
        (lines[h1idx + 1].startsWith('<h3') || lines[h1idx + 1].startsWith('## '))
      ) {
        insertAfter = h1idx + 1;
      }
      // Insert block: blank line, badge block, blank line
      lines.splice(insertAfter + 1, 0, '', '<p align="center">', badgeMd, '</p>', '');
      return lines.join('\n');
    }
  }

  // No heading found — prepend a badge block at the top
  return `<p align="center">\n${badgeMd}\n</p>\n\n${content}`;
}

export function countLines(content) {
  return content ? content.split('\n').length : 0;
}

export function countActiveSections(selectedSections) {
  return selectedSections.length;
}

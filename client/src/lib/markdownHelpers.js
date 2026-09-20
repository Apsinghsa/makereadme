/**
 * Insert a badge into the markdown after the first heading block.
 *
 * Badges are written as a plain markdown paragraph with blank lines around it,
 * so the image syntax renders as an image. Markdown inside a raw
 * `<p align="center">` block is not parsed and shows up as literal text.
 * Multiple badges share one line, separated by a space, so they stay in a row.
 */
export function insertBadgeAfterHeading(content, badgeMd) {
  if (!content) {
    return `${badgeMd}\n`;
  }

  const lines = content.split('\n');

  // Find the first heading — support both <h1 align="center"> and # Markdown headings
  const h1idx = lines.findIndex(
    (l) => l.startsWith('<h1') || l.startsWith('# ')
  );

  if (h1idx === -1) {
    return `${badgeMd}\n\n${content}`;
  }

  // Start right after the title, skipping the centered subheading when present.
  let pos = h1idx + 1;
  if (pos < lines.length && (lines[pos].startsWith('<h3') || lines[pos].startsWith('## '))) {
    pos++;
  }
  while (pos < lines.length && lines[pos].trim() === '') pos++;

  const first = lines[pos]?.trim() ?? '';
  const isBadgeLine = (l) => /^!\[.*\]\(.*\)/.test(l);

  if (isBadgeLine(first)) {
    // Append to the existing badge row (same line keeps them side by side).
    lines[pos] = `${lines[pos].replace(/\s+$/, '')} ${badgeMd}`;
    return lines.join('\n');
  }

  if (first === '<p align="center">') {
    // Unwrap a legacy centered block: markdown inside raw HTML renders as text.
    let end = pos;
    const badges = [];
    for (let i = pos + 1; i < lines.length; i++) {
      if (lines[i].trim().startsWith('</p>')) {
        end = i;
        break;
      }
      if (isBadgeLine(lines[i].trim())) badges.push(lines[i].trim());
      end = i;
    }
    badges.push(badgeMd);
    lines.splice(pos, end - pos + 1, badges.join(' '));
    return lines.join('\n');
  }

  // No badge paragraph yet — add one, with a blank line on each side.
  const block = lines[pos - 1]?.trim() === '' ? [badgeMd, ''] : ['', badgeMd, ''];
  lines.splice(pos, 0, ...block);
  return lines.join('\n');
}

export function countLines(content) {
  return content ? content.split('\n').length : 0;
}

export function countActiveSections(selectedSections) {
  return selectedSections.length;
}

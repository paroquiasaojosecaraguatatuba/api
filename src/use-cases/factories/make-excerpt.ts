export function makeExcerpt(content: string, maxLength = 200): string {
  if (content.length <= maxLength) {
    return content;
  }

  const excerpt = content.slice(0, maxLength);

  const lastSpaceIndex = excerpt.lastIndexOf(' ');

  if (lastSpaceIndex === -1) {
    return `${excerpt}...`;
  }

  return `${excerpt.slice(0, lastSpaceIndex)}...`;
}

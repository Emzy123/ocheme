/** First `<p>...</p>` block or stripped plain text prefix for previews */
export function firstParagraphHtml(html: string): string {
  const m = html.match(/<p[^>]*>[\s\S]*?<\/p>/i);
  if (m) return m[0];
  return `<p>${html.slice(0, 320)}${html.length > 320 ? "…" : ""}</p>`;
}

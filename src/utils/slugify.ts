// Responsible for converting heading text into a URL-safe anchor id.
// Supports ASCII, CJK, and other Unicode characters.
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .normalize("NFC")
      // Replace ASCII whitespace with hyphens
      .replace(/\s+/g, "-")
      // Remove characters that are not word chars, hyphens, or CJK/Unicode letters
      .replace(
        /[^\w\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef-]/g,
        "",
      )
      // Collapse consecutive hyphens
      .replace(/-{2,}/g, "-")
      // Strip leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

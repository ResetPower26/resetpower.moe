// Responsible for extracting article metadata and injecting Open Graph meta tags into HTML responses.

interface ArticleOgMeta {
  title: string;
  summary: string;
  firstImageUrl: string;
}

const MARKDOWN_IMAGE_REGEX = /!\[.*?\]\((https?:\/\/[^)\s]+)\)/;
const HTML_IMAGE_REGEX = /<img[^>]+src=["'](https?:\/\/[^"'\s]+)["']/i;

function extractFirstImageUrl(content: string): string {
  const markdownMatch = content.match(MARKDOWN_IMAGE_REGEX);
  if (markdownMatch) return markdownMatch[1];

  const htmlMatch = content.match(HTML_IMAGE_REGEX);
  if (htmlMatch) return htmlMatch[1];

  return "";
}

function buildOgMetaTags(meta: ArticleOgMeta): string {
  const escaped = {
    title: escapeHtmlAttribute(meta.title),
    summary: escapeHtmlAttribute(meta.summary),
    image: escapeHtmlAttribute(meta.firstImageUrl),
  };

  return [
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escaped.title}" />`,
    `<meta property="og:description" content="${escaped.summary}" />`,
    `<meta property="og:image" content="${escaped.image}" />`,
  ].join("\n    ");
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function injectOgMeta(
  htmlResponse: Response,
  title: string,
  summary: string,
  content: string,
): Response {
  const firstImageUrl = extractFirstImageUrl(content);
  const metaTags = buildOgMetaTags({ title, summary, firstImageUrl });

  return new HTMLRewriter()
    .on("head", {
      element(head) {
        head.append(`\n    ${metaTags}\n  `, { html: true });
      },
    })
    .transform(htmlResponse);
}

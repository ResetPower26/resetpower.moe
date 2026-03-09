// Responsible for routing all incoming requests and applying security headers.

import { handlePreflight, withSecurityHeaders } from "./lib/headers";
import { injectOgMeta } from "./lib/og-meta";
import { handleArticleRoutes } from "./routes/articles";
import { handleAuthRoutes } from "./routes/auth";
import { handleColumnRoutes } from "./routes/columns";
import { handleLinkRoutes } from "./routes/links";
import { handleProjectRoutes } from "./routes/projects";

const ARTICLE_SLUG_ROUTE = /^\/articles\/([^/]+)$/;

interface DbArticleMeta {
  title: string;
  summary: string;
  content: string;
}

async function fetchArticleMeta(
  env: Env,
  slug: string,
): Promise<DbArticleMeta | null> {
  return env.DB.prepare(
    "SELECT title, summary, content FROM articles WHERE slug = ? AND draft = 0",
  )
    .bind(slug)
    .first<DbArticleMeta>();
}

async function serveArticleWithOgMeta(
  request: Request,
  env: Env,
  slug: string,
): Promise<Response> {
  const [htmlResponse, article] = await Promise.all([
    env.ASSETS.fetch(new Request(new URL("/", request.url), request)),
    fetchArticleMeta(env, slug),
  ]);

  if (!article) return htmlResponse;

  return injectOgMeta(
    htmlResponse,
    article.title,
    article.summary,
    article.content,
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handlePreflight(origin);
    }

    if (url.pathname.startsWith("/api/")) {
      const apiResponse =
        (await handleAuthRoutes(request, env, url.pathname)) ??
        (await handleArticleRoutes(request, env, url.pathname)) ??
        (await handleProjectRoutes(request, env, url.pathname)) ??
        (await handleColumnRoutes(request, env, url.pathname)) ??
        (await handleLinkRoutes(request, env, url.pathname));
      if (apiResponse) {
        return withSecurityHeaders(apiResponse, origin);
      }
      return withSecurityHeaders(
        Response.json({ error: "Not found" }, { status: 404 }),
        origin,
      );
    }

    // Inject OG meta tags for article detail pages
    const slugMatch = url.pathname.match(ARTICLE_SLUG_ROUTE);
    if (slugMatch && request.method === "GET") {
      return serveArticleWithOgMeta(request, env, slugMatch[1]);
    }

    // SPA fallback: serve index.html for all non-API routes
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 404) {
      const indexRequest = new Request(new URL("/", request.url), request);
      return env.ASSETS.fetch(indexRequest);
    }

    return assetResponse;
  },
} satisfies ExportedHandler<Env>;

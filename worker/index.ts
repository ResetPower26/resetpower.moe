// Responsible for routing all incoming requests and applying security headers.

import { handlePreflight, withSecurityHeaders } from "./lib/headers";
import { handleArticleRoutes } from "./routes/articles";
import { handleAuthRoutes } from "./routes/auth";
import { handleLinkRoutes } from "./routes/links";
import { handleProjectRoutes } from "./routes/projects";

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
        (await handleLinkRoutes(request, env, url.pathname));
      if (apiResponse) {
        return withSecurityHeaders(apiResponse, origin);
      }
      return withSecurityHeaders(
        Response.json({ error: "Not found" }, { status: 404 }),
        origin,
      );
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

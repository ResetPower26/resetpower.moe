// Responsible for handling /api/articles/* routes including public reads and authenticated CRUD.
import { nanoid } from "nanoid";
import { requireAuth } from "../lib/auth-middleware";

interface DbArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string;
  created_at: number;
  author: string;
  disclosure: string;
}

interface DbArticleDetail extends DbArticle {
  content: string;
}

interface ArticleInput {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string;
  disclosure?: string;
}

function parseArticleTags(article: DbArticle) {
  return {
    ...article,
    tags: article.tags ? article.tags.split(";").map((t) => t.trim()) : [],
  };
}

function isValidArticleInput(body: unknown): body is ArticleInput {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.title === "string" &&
    typeof b.slug === "string" &&
    typeof b.summary === "string" &&
    typeof b.content === "string" &&
    typeof b.tags === "string"
  );
}

function isValidArticleUpdateInput(
  body: unknown,
): body is Omit<ArticleInput, "slug"> {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.title === "string" &&
    typeof b.summary === "string" &&
    typeof b.content === "string" &&
    typeof b.tags === "string"
  );
}

async function handleListArticles(env: Env): Promise<Response> {
  const result = await env.DB.prepare(
    "SELECT id, title, slug, summary, tags, created_at, author, disclosure FROM articles ORDER BY created_at DESC",
  ).all<DbArticle>();
  return Response.json({ articles: result.results.map(parseArticleTags) });
}

async function handleGetArticleBySlug(
  env: Env,
  slug: string,
): Promise<Response> {
  const row = await env.DB.prepare(
    "SELECT id, title, slug, content, summary, tags, created_at, author, disclosure FROM articles WHERE slug = ?",
  )
    .bind(slug)
    .first<DbArticleDetail>();

  if (!row) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }
  return Response.json({ article: parseArticleTags(row) });
}

async function handleGetArticleById(env: Env, id: string): Promise<Response> {
  const row = await env.DB.prepare(
    "SELECT id, title, slug, content, summary, tags, created_at, author, disclosure FROM articles WHERE id = ?",
  )
    .bind(id)
    .first<DbArticleDetail>();

  if (!row) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }
  return Response.json({ article: parseArticleTags(row) });
}

async function handleCreateArticle(
  request: Request,
  env: Env,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;

  if (payload.permission !== "all" && payload.permission !== "articles") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidArticleInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slugExists = await env.DB.prepare(
    "SELECT id FROM articles WHERE slug = ?",
  )
    .bind(body.slug)
    .first();

  if (slugExists) {
    return Response.json({ error: "Slug already exists" }, { status: 409 });
  }

  const id = nanoid();
  const now = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    "INSERT INTO articles (id, title, slug, summary, content, tags, created_at, author, disclosure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      id,
      body.title,
      body.slug,
      body.summary,
      body.content,
      body.tags,
      now,
      payload.username,
      body.disclosure ?? "",
    )
    .run();

  return Response.json({ success: true, id }, { status: 201 });
}

async function handleUpdateArticle(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;

  if (payload.permission !== "all" && payload.permission !== "articles") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (payload.permission === "articles") {
    const existing = await env.DB.prepare(
      "SELECT author FROM articles WHERE id = ?",
    )
      .bind(id)
      .first<{ author: string }>();

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.author !== payload.username) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidArticleUpdateInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await env.DB.prepare(
    "UPDATE articles SET title=?, summary=?, content=?, tags=?, disclosure=? WHERE id=?",
  )
    .bind(
      body.title,
      body.summary,
      body.content,
      body.tags,
      body.disclosure ?? "",
      id,
    )
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

async function handleDeleteArticle(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;

  if (payload.permission !== "all" && payload.permission !== "articles") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (payload.permission === "articles") {
    const existing = await env.DB.prepare(
      "SELECT author FROM articles WHERE id = ?",
    )
      .bind(id)
      .first<{ author: string }>();

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.author !== payload.username) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const result = await env.DB.prepare("DELETE FROM articles WHERE id = ?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

export async function handleArticleRoutes(
  request: Request,
  env: Env,
  pathname: string,
): Promise<Response | null> {
  if (pathname === "/api/articles/list" && request.method === "GET") {
    return handleListArticles(env);
  }

  if (pathname === "/api/articles" && request.method === "POST") {
    return handleCreateArticle(request, env);
  }

  const idMatch = pathname.match(/^\/api\/articles\/id\/([^/]+)$/);
  if (idMatch) {
    const id = idMatch[1];
    if (request.method === "GET") return handleGetArticleById(env, id);
    if (request.method === "PUT") return handleUpdateArticle(request, env, id);
    if (request.method === "DELETE")
      return handleDeleteArticle(request, env, id);
  }

  const slugMatch = pathname.match(/^\/api\/articles\/([^/]+)$/);
  if (slugMatch && request.method === "GET") {
    return handleGetArticleBySlug(env, slugMatch[1]);
  }

  return null;
}

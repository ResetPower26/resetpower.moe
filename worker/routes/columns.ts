// Responsible for handling /api/columns/* routes including public reads and authenticated CRUD (all permission only).
import { requireAuth } from "../lib/auth-middleware";

interface DbColumn {
  id: number;
  name: string;
  description: string | null;
  cover_image: string | null;
  article_ids: string;
}

interface DbArticleSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  created_at: number;
  author: string;
}

interface ColumnInput {
  name: string;
  description?: string;
  cover_image?: string;
  article_ids: string;
}

function isValidColumnInput(body: unknown): body is ColumnInput {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b.name === "string" && typeof b.article_ids === "string";
}

function parseArticleIds(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function fetchArticleSummariesByIds(
  env: Env,
  ids: string[],
): Promise<DbArticleSummary[]> {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const result = await env.DB.prepare(
    `SELECT id, title, slug, summary, created_at, author FROM articles WHERE id IN (${placeholders})`,
  )
    .bind(...ids)
    .all<DbArticleSummary>();
  const rowMap = new Map(result.results.map((r) => [r.id, r]));
  return ids.map((id) => rowMap.get(id)).filter(Boolean) as DbArticleSummary[];
}

async function enrichColumnWithArticles(env: Env, column: DbColumn) {
  const ids = parseArticleIds(column.article_ids);
  const articles = await fetchArticleSummariesByIds(env, ids);
  return { ...column, articles };
}

async function handleListColumns(env: Env): Promise<Response> {
  const result = await env.DB.prepare(
    "SELECT id, name, description, cover_image, article_ids FROM columns ORDER BY id DESC",
  ).all<DbColumn>();

  const enriched = await Promise.all(
    result.results.map((col) => enrichColumnWithArticles(env, col)),
  );
  return Response.json({ columns: enriched });
}

async function syncArticleColumnIds(
  env: Env,
  columnId: number,
  articleIds: string[],
): Promise<void> {
  if (articleIds.length > 0) {
    const placeholders = articleIds.map(() => "?").join(",");
    await env.DB.prepare(
      `UPDATE articles SET column_id = ? WHERE id IN (${placeholders})`,
    )
      .bind(columnId, ...articleIds)
      .run();
  }
}

async function clearArticleColumnIds(
  env: Env,
  columnId: number,
  articleIds: string[],
): Promise<void> {
  if (articleIds.length === 0) return;
  const placeholders = articleIds.map(() => "?").join(",");
  await env.DB.prepare(
    `UPDATE articles SET column_id = NULL WHERE column_id = ? AND id IN (${placeholders})`,
  )
    .bind(columnId, ...articleIds)
    .run();
}

async function handleCreateColumn(
  request: Request,
  env: Env,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  if (payload.permission !== "all") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidColumnInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await env.DB.prepare(
    "INSERT INTO columns (name, description, cover_image, article_ids) VALUES (?, ?, ?, ?)",
  )
    .bind(
      body.name,
      body.description ?? null,
      body.cover_image ?? null,
      body.article_ids,
    )
    .run();

  const newColumnId = result.meta.last_row_id as number;
  const articleIds = parseArticleIds(body.article_ids);
  await syncArticleColumnIds(env, newColumnId, articleIds);

  return Response.json({ success: true, id: newColumnId }, { status: 201 });
}

async function handleUpdateColumn(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  if (payload.permission !== "all") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidColumnInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Fetch existing article_ids before updating, to detect removed articles.
  const existing = await env.DB.prepare(
    "SELECT article_ids FROM columns WHERE id = ?",
  )
    .bind(id)
    .first<{ article_ids: string }>();

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const result = await env.DB.prepare(
    "UPDATE columns SET name=?, description=?, cover_image=?, article_ids=? WHERE id=?",
  )
    .bind(
      body.name,
      body.description ?? null,
      body.cover_image ?? null,
      body.article_ids,
      id,
    )
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const columnId = Number(id);
  const newArticleIds = parseArticleIds(body.article_ids);
  const oldArticleIds = parseArticleIds(existing.article_ids);
  const removedIds = oldArticleIds.filter(
    (aid) => !newArticleIds.includes(aid),
  );

  await clearArticleColumnIds(env, columnId, removedIds);
  await syncArticleColumnIds(env, columnId, newArticleIds);

  return Response.json({ success: true });
}

async function handleDeleteColumn(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  if (payload.permission !== "all") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await env.DB.prepare(
    "SELECT article_ids FROM columns WHERE id = ?",
  )
    .bind(id)
    .first<{ article_ids: string }>();

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const result = await env.DB.prepare("DELETE FROM columns WHERE id=?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const columnId = Number(id);
  const articleIds = parseArticleIds(existing.article_ids);
  await clearArticleColumnIds(env, columnId, articleIds);

  return Response.json({ success: true });
}

export async function handleColumnRoutes(
  request: Request,
  env: Env,
  pathname: string,
): Promise<Response | null> {
  if (pathname === "/api/columns/list" && request.method === "GET") {
    return handleListColumns(env);
  }

  if (pathname === "/api/columns" && request.method === "POST") {
    return handleCreateColumn(request, env);
  }

  const idMatch = pathname.match(/^\/api\/columns\/(\d+)$/);
  if (idMatch) {
    const id = idMatch[1];
    if (request.method === "PUT") return handleUpdateColumn(request, env, id);
    if (request.method === "DELETE")
      return handleDeleteColumn(request, env, id);
  }

  return null;
}

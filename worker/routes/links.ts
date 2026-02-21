// Responsible for handling /api/links/* routes including public list and admin CRUD.
import { requireAuth, requirePermission } from "../lib/auth-middleware";

interface DbLink {
  id: number;
  name: string;
  description: string;
  avatar: string;
  link: string;
}

interface LinkInput {
  name: string;
  description: string;
  avatar: string;
  link: string;
}

function isValidLinkInput(body: unknown): body is LinkInput {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.description === "string" &&
    typeof b.avatar === "string" &&
    typeof b.link === "string"
  );
}

async function handleListLinks(env: Env): Promise<Response> {
  const result = await env.DB.prepare(
    "SELECT id, name, description, avatar, link FROM link_exchange",
  ).all<DbLink>();
  return Response.json({ links: result.results });
}

async function handleCreateLink(request: Request, env: Env): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  const forbidden = requirePermission(payload, "all");
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidLinkInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO link_exchange (name, description, avatar, link) VALUES (?, ?, ?, ?)",
  )
    .bind(body.name, body.description, body.avatar, body.link)
    .run();

  return Response.json({ success: true }, { status: 201 });
}

async function handleUpdateLink(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  const forbidden = requirePermission(payload, "all");
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidLinkInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await env.DB.prepare(
    "UPDATE link_exchange SET name=?, description=?, avatar=?, link=? WHERE id=?",
  )
    .bind(body.name, body.description, body.avatar, body.link, id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

async function handleDeleteLink(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  const forbidden = requirePermission(payload, "all");
  if (forbidden) return forbidden;

  const result = await env.DB.prepare("DELETE FROM link_exchange WHERE id=?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

export async function handleLinkRoutes(
  request: Request,
  env: Env,
  pathname: string,
): Promise<Response | null> {
  if (pathname === "/api/links/list" && request.method === "GET") {
    return handleListLinks(env);
  }
  if (pathname === "/api/links" && request.method === "POST") {
    return handleCreateLink(request, env);
  }

  const editMatch = pathname.match(/^\/api\/links\/(\d+)$/);
  if (editMatch) {
    const id = editMatch[1];
    if (request.method === "PUT") return handleUpdateLink(request, env, id);
    if (request.method === "DELETE") return handleDeleteLink(request, env, id);
  }

  return null;
}

// Responsible for handling /api/projects/* routes including public list and admin CRUD.
import { requireAuth, requirePermission } from "../lib/auth-middleware";

interface DbProject {
  id: number;
  name: string;
  description: string;
  tags: string;
  link: string;
  link_demo: string | null;
}

interface ProjectInput {
  name: string;
  description: string;
  tags: string;
  link: string;
  link_demo?: string | null;
}

function parseProjectTags(project: DbProject) {
  return {
    ...project,
    tags: project.tags ? project.tags.split(";").map((t) => t.trim()) : [],
  };
}

function isValidProjectInput(body: unknown): body is ProjectInput {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.description === "string" &&
    typeof b.tags === "string" &&
    typeof b.link === "string"
  );
}

async function handleListProjects(env: Env): Promise<Response> {
  const result = await env.DB.prepare(
    "SELECT id, name, description, tags, link, link_demo FROM projects",
  ).all<DbProject>();
  return Response.json({ projects: result.results.map(parseProjectTags) });
}

async function handleCreateProject(
  request: Request,
  env: Env,
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

  if (!isValidProjectInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO projects (name, description, tags, link, link_demo) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(
      body.name,
      body.description,
      body.tags,
      body.link,
      body.link_demo ?? null,
    )
    .run();

  return Response.json({ success: true }, { status: 201 });
}

async function handleUpdateProject(
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

  if (!isValidProjectInput(body)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await env.DB.prepare(
    "UPDATE projects SET name=?, description=?, tags=?, link=?, link_demo=? WHERE id=?",
  )
    .bind(
      body.name,
      body.description,
      body.tags,
      body.link,
      body.link_demo ?? null,
      id,
    )
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

async function handleDeleteProject(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const payload = await requireAuth(request, env);
  if (payload instanceof Response) return payload;
  const forbidden = requirePermission(payload, "all");
  if (forbidden) return forbidden;

  const result = await env.DB.prepare("DELETE FROM projects WHERE id=?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}

export async function handleProjectRoutes(
  request: Request,
  env: Env,
  pathname: string,
): Promise<Response | null> {
  if (pathname === "/api/projects/list" && request.method === "GET") {
    return handleListProjects(env);
  }
  if (pathname === "/api/projects" && request.method === "POST") {
    return handleCreateProject(request, env);
  }

  const editMatch = pathname.match(/^\/api\/projects\/(\d+)$/);
  if (editMatch) {
    const id = editMatch[1];
    if (request.method === "PUT") return handleUpdateProject(request, env, id);
    if (request.method === "DELETE")
      return handleDeleteProject(request, env, id);
  }

  return null;
}

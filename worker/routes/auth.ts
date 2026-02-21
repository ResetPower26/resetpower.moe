// Responsible for handling /api/authenticate and /api/validate routes.

import { signJwt, verifyJwt } from "../lib/jwt";
import { verifyPassword } from "../lib/password";

interface DbUser {
  id: string;
  name: string;
  password: string;
  permission: string;
}

async function handleAuthenticate(
  request: Request,
  env: Env,
): Promise<Response> {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return Response.json(
      { error: "username and password are required" },
      { status: 400 },
    );
  }

  const user = await env.DB.prepare(
    "SELECT id, name, password, permission FROM users WHERE name = ?",
  )
    .bind(username)
    .first<DbUser>();

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signJwt(
    { sub: user.id, username: user.name, permission: user.permission },
    env.JWT_SECRET,
  );

  return Response.json({ token });
}

async function handleValidate(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ valid: false }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload = await verifyJwt(token, env.JWT_SECRET);

  if (!payload) {
    return Response.json({ valid: false }, { status: 401 });
  }

  return Response.json({
    valid: true,
    username: payload.username,
    permission: payload.permission,
  });
}

export async function handleAuthRoutes(
  request: Request,
  env: Env,
  pathname: string,
): Promise<Response | null> {
  if (pathname === "/api/authenticate" && request.method === "POST") {
    return handleAuthenticate(request, env);
  }
  if (pathname === "/api/validate" && request.method === "GET") {
    return handleValidate(request, env);
  }
  return null;
}

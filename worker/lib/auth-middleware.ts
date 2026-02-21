// Responsible for extracting and verifying the JWT from the Authorization header.
import type { JwtPayload } from "./jwt";
import { verifyJwt } from "./jwt";

export async function requireAuth(
  request: Request,
  env: Env,
): Promise<JwtPayload | Response> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload = await verifyJwt(token, env.JWT_SECRET);

  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return payload;
}

export function requirePermission(
  payload: JwtPayload,
  permission: string,
): Response | null {
  if (payload.permission !== permission) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// Responsible for applying CORS and security headers to all Worker responses.

const ALLOWED_ORIGIN = "https://resetpower.moe";

function getAllowedOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) return ALLOWED_ORIGIN;
  // Allow localhost in development
  if (requestOrigin.startsWith("http://localhost")) return requestOrigin;
  return ALLOWED_ORIGIN;
}

export function withSecurityHeaders(
  response: Response,
  requestOrigin: string | null,
): Response {
  const headers = new Headers(response.headers);

  headers.set("Access-Control-Allow-Origin", getAllowedOrigin(requestOrigin));
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'",
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function handlePreflight(requestOrigin: string | null): Response {
  return withSecurityHeaders(
    new Response(null, { status: 204 }),
    requestOrigin,
  );
}

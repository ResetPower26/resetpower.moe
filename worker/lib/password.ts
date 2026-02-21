// Responsible for hashing and verifying passwords using SHA-256 via Web Crypto API.

export async function hashPassword(plaintext: string): Promise<string> {
  const data = new TextEncoder().encode(plaintext);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  plaintext: string,
  storedHash: string,
): Promise<boolean> {
  const computedHash = await hashPassword(plaintext);
  return computedHash === storedHash;
}

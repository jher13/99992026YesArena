import { createRemoteJWKSet, decodeProtectedHeader, errors, jwtVerify } from "jose";

const project = Deno.env.get("SUPABASE_URL")!;
const issuer = project + "/auth/v1";
const keys = createRemoteJWKSet(new URL(issuer + "/.well-known/jwks.json"), { timeoutDuration: 1500 });
export const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function userFromAuth(authorization: string) {
  const response = await fetch(issuer + "/user", {
    headers: { apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, Authorization: authorization },
  });
  if (response.status >= 500 || response.status === 429) throw Error("Supabase Auth is unavailable.");
  if (!response.ok) return null;
  const { id } = await response.json();
  return typeof id === "string" && uuid.test(id) ? { id, session: null } : null;
}

export async function battleUser(authorization: string, campaign: boolean) {
  if (campaign) return userFromAuth(authorization);
  const token = authorization.slice(7);
  try {
    const { alg } = decodeProtectedHeader(token);
    if (alg !== "ES256" && alg !== "RS256") return userFromAuth(authorization);
    const { payload } = await jwtVerify(token, keys, {
      issuer, audience: "authenticated", algorithms: ["ES256", "RS256"],
      requiredClaims: ["exp", "sub", "role"],
    });
    if (payload.role !== "authenticated" || !uuid.test(payload.sub!)) return null;
    if (!payload.session_id) return userFromAuth(authorization);
    if (typeof payload.session_id !== "string" || !uuid.test(payload.session_id)) return null;
    return { id: payload.sub!, session: payload.session_id };
  } catch (error) {
    // A rotating or temporarily unavailable key can still be verified by Auth.
    if (error instanceof errors.JWKSNoMatchingKey || error instanceof errors.JWKSTimeout ||
        error instanceof TypeError || (error instanceof errors.JOSEError && error.code === "ERR_JOSE_GENERIC")) {
      return userFromAuth(authorization);
    }
    return null;
  }
}

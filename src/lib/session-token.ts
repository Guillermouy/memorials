import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/generated/prisma/client";

/**
 * Firma y verificación del token de sesión, sin nada atado a la petición.
 *
 * Vive separado de `session.ts` a propósito: el proxy corre en el runtime edge
 * y necesita validar la cookie, pero no puede importar `next/headers` ni nada
 * que arrastre Prisma. Acá solo entra `jose`, que sí funciona en edge.
 */

export const SESSION_COOKIE = "memorials_session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

export type SessionPayload = {
  userId: string;
  email: string;
  role: Role;
};

/**
 * La clave se lee en cada llamada y no al importar el módulo: si se leyera
 * arriba, el build (que corre sin variables de entorno) la fijaría en
 * `undefined` y la firma quedaría rota en runtime.
 */
function key(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Falta SESSION_SECRET. Generá una con: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key());
}

/** Devuelve null ante cualquier token inválido, vencido o manipulado. */
export async function decryptSession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    const { userId, email, role } = payload as Partial<SessionPayload>;
    if (!userId || !email || !role) return null;
    return { userId, email, role };
  } catch {
    // Firma inválida o token vencido: se trata como "sin sesión".
    return null;
  }
}

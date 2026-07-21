import "server-only";

import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  decryptSession,
  encryptSession,
  type SessionPayload,
} from "@/lib/session-token";

/**
 * Manejo de la cookie de sesión. La firma y verificación del token viven en
 * `session-token.ts`, que también usa el proxy.
 *
 * Sesión sin estado: los datos viajan firmados en la cookie, sin tabla de
 * sesiones. Alcanza para un panel de pocas cuentas y evita una consulta por
 * request. El costo es que una sesión no se puede revocar antes de que venza;
 * `verifySession` compensa en parte revalidando el usuario contra la base.
 */

export type { SessionPayload };

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // En desarrollo el sitio va por http, donde una cookie Secure nunca se envía.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value);
}

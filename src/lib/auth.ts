import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { hash, verify } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { readSession, type SessionPayload } from "@/lib/session";

/**
 * Capa de acceso a datos para la autenticación del panel.
 *
 * La doc de Next es explícita en que el proxy sirve solo para chequeos
 * optimistas —lee la cookie, no consulta la base— y que la verificación de
 * verdad va lo más cerca posible del dato. Por eso cada página, cada Server
 * Action y cada Route Handler del panel llama a `requireUser()` por su cuenta,
 * en vez de confiar en que el proxy ya filtró.
 */

/**
 * Parámetros de argon2id. Son los valores recomendados por OWASP: 19 MiB de
 * memoria, 2 iteraciones y 1 hilo.
 */
const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  passwordHash: string,
  password: string
): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    // Un hash corrupto o con otro formato no debe tumbar el login.
    return false;
  }
}

/**
 * Lee la sesión de la cookie y confirma que el usuario siga existiendo.
 *
 * La consulta importa: la cookie está firmada y por lo tanto es confiable, pero
 * sigue siendo válida hasta que vence aunque la cuenta se haya borrado. Sin
 * este chequeo, una cuenta eliminada conservaría acceso hasta 8 horas.
 *
 * Va envuelta en `cache` de React para que las varias llamadas de un mismo
 * render (layout, página, acciones) compartan una sola consulta.
 */
export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  const session = await readSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) return null;

  // El rol se toma de la base, no de la cookie: si a alguien le bajaron los
  // permisos, el cambio tiene efecto en la petición siguiente.
  return { userId: user.id, email: user.email, role: user.role };
});

/** Exige sesión; si no la hay, manda al login conservando el destino. */
export async function requireUser(
  returnTo?: string
): Promise<SessionPayload> {
  const session = await verifySession();
  if (!session) {
    const target = returnTo
      ? `/admin/login?next=${encodeURIComponent(returnTo)}`
      : "/admin/login";
    redirect(target);
  }
  return session;
}

/** Exige además el rol ADMIN, para lo que toca cuentas de usuario. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireUser();
  if (session.role !== "ADMIN") {
    redirect("/admin?error=" + encodeURIComponent("No tenés permisos para eso."));
  }
  return session;
}

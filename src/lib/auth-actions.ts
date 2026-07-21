"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

/** Mismo texto para usuario inexistente y clave incorrecta. */
const BAD_CREDENTIALS = "Email o contraseña incorrectos.";

function loginFailed(next: string | null): never {
  const params = new URLSearchParams({ error: BAD_CREDENTIALS });
  if (next) params.set("next", next);
  redirect(`/admin/login?${params}`);
}

/**
 * Declarada como `function` y no como arrow: TypeScript solo propaga el `never`
 * —y entiende que la ejecución se corta acá— para declaraciones de función.
 */
function accountFailed(message: string): never {
  redirect(`/admin/cuenta?error=${encodeURIComponent(message)}`);
}

/** Solo se aceptan destinos internos: un `next` externo sería un open redirect. */
function safeNext(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value === "") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export async function login(fd: FormData) {
  const emailRaw = fd.get("email");
  const password = fd.get("password");
  const next = safeNext(fd.get("next"));

  const email =
    typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";

  if (!email || typeof password !== "string" || password === "") {
    loginFailed(next);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, passwordHash: true },
  });

  if (!user) {
    // Se gasta un hash a propósito para que el login tarde lo mismo exista o no
    // la cuenta: cortar acá haría que el tiempo de respuesta delate qué emails
    // están registrados.
    await hashPassword(password);
    loginFailed(next);
  }

  if (!(await verifyPassword(user.passwordHash, password))) {
    loginFailed(next);
  }

  await createSession({ userId: user.id, email: user.email, role: user.role });

  redirect(next ?? "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/** Cambio de contraseña de la propia cuenta. */
export async function changePassword(fd: FormData) {
  const session = await requireUser();

  const current = fd.get("currentPassword");
  const newPassword = fd.get("newPassword");

  if (typeof current !== "string" || typeof newPassword !== "string") {
    accountFailed("Completá los dos campos.");
  }
  if (newPassword.length < 10) {
    accountFailed("La contraseña nueva debe tener al menos 10 caracteres.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { passwordHash: true },
  });
  if (!user || !(await verifyPassword(user.passwordHash, current))) {
    accountFailed("La contraseña actual no es correcta.");
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  redirect("/admin/cuenta?saved=1");
}

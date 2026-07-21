import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, decryptSession } from "@/lib/session-token";

/**
 * En Next 16 el middleware pasó a llamarse proxy; el comportamiento es el mismo.
 *
 * Esto es solo un chequeo optimista, como recomienda la doc: lee la cookie para
 * sacar de encima al visitante sin sesión antes de renderizar, y nada más. La
 * autorización de verdad la hace `requireUser()` en cada página, acción y route
 * handler, porque el proxy no alcanza a ver la base y una cookie válida no
 * garantiza que la cuenta siga existiendo.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  // Ya con sesión, el login no tiene sentido: al panel.
  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/admin/login", request.url);
    // Se conserva el destino para volver ahí después de entrar.
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  // Cubre las páginas del panel y la subida de fotos, que es su única API.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

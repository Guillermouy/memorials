import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administración",
  // Nada del panel debe aparecer en buscadores, ni siquiera el login.
  robots: { index: false, follow: false },
};

/**
 * Envoltura mínima común a todo /admin. El cromo del panel (menú, sesión) vive
 * en el layout del grupo (panel), para que la pantalla de login —que se ve sin
 * sesión— no herede un menú que todavía no se puede usar.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}

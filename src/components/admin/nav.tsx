"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Grid3x3, Users } from "lucide-react";

const sections = [
  { href: "/admin/cemeteries", label: "Cementerios", icon: Building2 },
  { href: "/admin/niches", label: "Lugares", icon: Grid3x3 },
  { href: "/admin/people", label: "Personas", icon: Users },
] as const;

/**
 * Menú principal del panel. Marca la sección abierta comparando con la ruta
 * actual, incluidas las páginas de detalle: estando en /admin/people/<id> la
 * pestaña Personas sigue resaltada.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {sections.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
              active
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-accent"
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

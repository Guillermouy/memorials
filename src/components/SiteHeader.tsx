import Link from "next/link";
import { Flame, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * `admin` agrega el acceso al panel. Va apagado por defecto y solo se enciende
 * en la portada: en la página de un lugar o de una persona, quien llega viene
 * de escanear un QR frente a una tumba, y no es el momento de ofrecerle una
 * pantalla de login.
 */
export function SiteHeader({
  breadcrumb,
  admin = false,
}: {
  breadcrumb?: string;
  admin?: boolean;
}) {
  return (
    <header className="card-glass sticky top-0 z-40 border-x-0 border-t-0 shadow-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Flame
            size={18}
            className="text-candle transition-transform group-hover:scale-110"
            strokeWidth={1.75}
          />
          <span className="font-serif-display text-xl tracking-wide">
            Memorials
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {breadcrumb && (
            <span className="hidden font-technical text-xs uppercase tracking-wider text-muted sm:block truncate max-w-xs">
              {breadcrumb}
            </span>
          )}
          {admin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-technical text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Lock size={13} strokeWidth={1.75} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

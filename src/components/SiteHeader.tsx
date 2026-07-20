import Link from "next/link";
import { Flame } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader({ breadcrumb }: { breadcrumb?: string }) {
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

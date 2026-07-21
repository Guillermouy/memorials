import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Banner, SectionCard } from "@/components/admin/ui";
import { formatLifespan, fullName } from "@/lib/format";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; deleted?: string; saved?: string }>;
}) {
  await requireUser("/admin/people");
  const sp = await searchParams;

  const people = await prisma.person.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { niche: { select: { code: true } } },
  });

  return (
    <div className="space-y-8">
      <Banner error={sp.error} saved={sp.saved} deleted={sp.deleted} />

      <SectionCard title="Personas">
        {people.length === 0 ? (
          <p className="text-sm text-muted">
            Todavía no hay personas. Se crean desde la ficha de un lugar.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {people.map((p) => {
              const lifespan = formatLifespan(p.birthDate, p.deathDate);
              return (
                <li key={p.id}>
                  <Link
                    href={`/admin/people/${p.id}`}
                    className="flex items-center gap-3 py-3 transition-colors hover:text-accent"
                  >
                    <Users size={18} className="shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {fullName(p)}
                      </span>
                      <span className="font-technical text-xs text-muted">
                        {p.niche.code}
                        {lifespan ? ` · ${lifespan}` : ""}
                      </span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

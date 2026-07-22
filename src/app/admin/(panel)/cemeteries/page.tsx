import Link from "next/link";
import { Building2, ChevronRight, Map, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createCemetery } from "@/lib/admin-actions";
import { Banner, Field, SectionCard } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/actions-ui";

export default async function CemeteriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; deleted?: string; saved?: string }>;
}) {
  await requireUser("/admin/cemeteries");
  const sp = await searchParams;

  const cemeteries = await prisma.cemetery.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { niches: true } },
      niches: { select: { _count: { select: { people: true } } } },
    },
  });

  return (
    <div className="space-y-8">
      <Banner error={sp.error} saved={sp.saved} deleted={sp.deleted} />

      <SectionCard title="Cementerios">
        {cemeteries.length === 0 ? (
          <p className="text-sm text-muted">
            Aún no hay cementerios. Crea el primero abajo.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {cemeteries.map((c) => {
              const people = c.niches.reduce((sum, n) => sum + n._count.people, 0);
              return (
                <li key={c.id}>
                  <Link
                    href={`/admin/cemeteries/${c.id}`}
                    className="flex items-center gap-3 py-3 transition-colors hover:text-accent"
                  >
                    <Building2 size={18} className="shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{c.name}</span>
                      <span className="font-technical text-xs text-muted">
                        {[c.city, c.country].filter(Boolean).join(", ") ||
                          "Sin ubicación"}{" "}
                        · {c._count.niches} lugar{c._count.niches === 1 ? "" : "es"} ·{" "}
                        {people} persona{people === 1 ? "" : "s"}
                      </span>
                    </span>
                    {c.latitude !== null && c.longitude !== null && (
                      // Indicador, no enlace: la fila entera ya es un enlace y
                      // anidar uno dentro de otro es HTML inválido.
                      <Map
                        size={14}
                        className="shrink-0 text-accent"
                        aria-label="Tiene ubicación en el mapa"
                      />
                    )}
                    <ChevronRight size={16} className="shrink-0 text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Nuevo cementerio">
        <form action={createCemetery} className="space-y-4">
          <Field
            label="Nombre"
            name="name"
            required
            placeholder="Cementerio Jardines del Recuerdo"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Ciudad" name="city" placeholder="Monterrey" />
            <Field label="País" name="country" placeholder="México" />
          </div>
          <Field label="Dirección" name="address" placeholder="Av. Principal 123" />
          <Field
            label="Coordenadas"
            name="coordinates"
            placeholder="-34.858118, -56.228550"
            hint="Opcional. Pegá acá lo que copiás de Google Maps: la entrada del cementerio."
          />
          <SubmitButton>
            <Plus size={15} /> Crear cementerio
          </SubmitButton>
        </form>
      </SectionCard>
    </div>
  );
}

import { KeyRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { changePassword } from "@/lib/auth-actions";
import { Banner, Field, SectionCard } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/actions-ui";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireUser("/admin/cuenta");
  const sp = await searchParams;

  return (
    <div className="space-y-8">
      <Banner error={sp.error} saved={sp.saved} />

      <SectionCard title="Tu cuenta">
        <dl className="grid grid-cols-1 gap-3 font-technical text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted">Email</dt>
            <dd>{session.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted">Rol</dt>
            <dd>{session.role === "ADMIN" ? "Administrador" : "Editor"}</dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="Cambiar contraseña">
        <form action={changePassword} className="space-y-4">
          <Field
            label="Contraseña actual"
            name="currentPassword"
            type="password"
            required
          />
          <Field
            label="Contraseña nueva"
            name="newPassword"
            type="password"
            required
            hint="Mínimo 10 caracteres."
          />
          <SubmitButton>
            <KeyRound size={15} /> Cambiar contraseña
          </SubmitButton>
        </form>
      </SectionCard>
    </div>
  );
}

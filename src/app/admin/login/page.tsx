import type { Metadata } from "next";
import { LogIn, ShieldCheck } from "lucide-react";
import { login } from "@/lib/auth-actions";
import { Field } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/actions-ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 py-16">
      <div className="card-glass rounded-2xl p-7">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck size={20} className="text-accent" />
          <h1 className="font-serif-display text-2xl">Administración</h1>
        </div>

        {sp.error && (
          <p className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
            {sp.error}
          </p>
        )}

        <form action={login} className="space-y-4">
          {sp.next && <input type="hidden" name="next" value={sp.next} />}
          <Field
            label="Email"
            name="email"
            type="email"
            required
            placeholder="nombre@ejemplo.com"
          />
          <Field label="Contraseña" name="password" type="password" required />
          <SubmitButton className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60">
            <LogIn size={15} /> Entrar
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

import "dotenv/config";
import { hash } from "@node-rs/argon2";
import { PrismaClient, type Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Alta de cuentas del panel desde la terminal.
 *
 * No hay registro por pantalla a propósito: el panel administra un cementerio,
 * no una comunidad abierta, así que las cuentas se crean a mano.
 *
 *   npm run user:create -- alguien@ejemplo.com "clave-larga" ADMIN
 *
 * Si el email ya existe, se le actualiza la contraseña y el rol. Eso lo hace
 * también la forma de recuperar el acceso si alguien pierde la clave.
 */

const [email, password, roleArg] = process.argv.slice(2);

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!email || !password) {
  fail(
    'Uso: npm run user:create -- <email> <contraseña> [ADMIN|EDITOR]\n' +
      '  ej: npm run user:create -- gustavo@ejemplo.com "una-clave-larga" ADMIN'
  );
}

if (!email.includes("@")) fail(`"${email}" no parece un email.`);
if (password.length < 10) fail("La contraseña debe tener al menos 10 caracteres.");

const roleInput = (roleArg ?? "ADMIN").toUpperCase();
if (roleInput !== "ADMIN" && roleInput !== "EDITOR") {
  fail(`Rol inválido: "${roleArg}". Usá ADMIN o EDITOR.`);
}
const role: Role = roleInput;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) fail("Falta DATABASE_URL en el entorno.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const normalized = email.toLowerCase().trim();

  // Mismos parámetros que usa el login (OWASP para argon2id).
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const existing = await prisma.user.findUnique({
    where: { email: normalized },
    select: { id: true },
  });

  const user = await prisma.user.upsert({
    where: { email: normalized },
    create: { email: normalized, passwordHash, role },
    update: { passwordHash, role },
    select: { email: true, role: true },
  });

  console.log(
    `\n  ${existing ? "Actualizada" : "Creada"} la cuenta ${user.email} (${user.role}).\n`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

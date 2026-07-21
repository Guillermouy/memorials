import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // argon2 es un módulo nativo: si Next lo empaqueta, el .node deja de
  // resolverse y el hash de contraseñas revienta en runtime.
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;

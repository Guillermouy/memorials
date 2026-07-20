"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 31) % 100}%`,
  delay: (i % 6) * 1.2,
  duration: 6 + (i % 4) * 1.5,
}));

export function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="bg-grid absolute inset-0" />
      <div className="absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-candle/10 blur-3xl" />
      <div className="absolute right-[8%] top-24 h-[280px] w-[280px] rounded-full bg-glow/20 blur-3xl" />
      <div className="absolute left-[6%] top-40 h-[220px] w-[220px] rounded-full bg-glow/10 blur-3xl" />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-candle/60"
          style={{ left: p.left }}
          animate={{
            y: [0, -160],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

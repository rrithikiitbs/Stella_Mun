import type { ReactNode } from "react";

// Keep content server rendered; the previous per-item Framer Motion client
// wrappers added hydration and animation work without adding essential behavior.
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return <div className={className}>{children}</div>;
}

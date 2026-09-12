import type { ReactNode } from "react";

type PageBackgroundProps = {
  children: ReactNode;
  /** Extra classes for the `<main>` wrapper (layout only — never touch the glow layer itself). */
  mainClassName?: string;
};

/**
 * DEALING's signature ambient background — three drifting glow blobs behind
 * a subtle overlay, fixed behind the page content. Every route on the
 * platform is wrapped in this; see the "Signature background" rule in
 * CLAUDE.md before creating a new page/layout.
 */
export function PageBackground({ children, mainClassName = "" }: PageBackgroundProps) {
  return (
    <main className={`relative min-h-screen overflow-hidden ${mainClassName}`}>
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute -top-[10%] -left-[20%] h-[35%] w-[150%] animate-[wave-drift-1_7s_ease-in-out_infinite] bg-primary/15 blur-[120px]" />
        <div className="absolute top-[35%] -right-[20%] h-[25%] w-[150%] animate-[wave-drift-2_9s_ease-in-out_infinite] bg-amber-600/10 blur-[100px]" />
        <div className="absolute -bottom-[15%] -left-[10%] h-[30%] w-[120%] animate-[wave-drift-3_11s_ease-in-out_infinite] bg-primary/15 blur-[120px]" />
        <div className="absolute inset-0 bg-background/20 mix-blend-overlay" />
      </div>
      <div className="relative z-10">{children}</div>
    </main>
  );
}

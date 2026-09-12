import type { ReactNode } from "react";

type GlassFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function GlassField({ label, htmlFor, error, hint, children }: GlassFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-xs font-medium tracking-wide text-textMuted uppercase">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-textMuted/70">{hint}</p>}
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

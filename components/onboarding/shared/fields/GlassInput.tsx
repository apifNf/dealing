import { forwardRef, type InputHTMLAttributes } from "react";

type GlassInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(function GlassInput(
  { invalid, className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`
        w-full rounded-2xl bg-white/[0.02] border px-4 py-3 text-sm text-textMain
        placeholder:text-textMuted/50 backdrop-blur-2xl
        transition-all duration-300 outline-none
        focus:bg-white/[0.04] focus:shadow-[0_0_0_3px_rgba(194,65,12,0.25)]
        ${invalid ? "border-red-500/50 focus:border-red-500/70" : "border-white/10 focus:border-primary/60"}
        ${className}
      `}
      {...props}
    />
  );
});

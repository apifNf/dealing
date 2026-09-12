import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

type GlassSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(function GlassSelect(
  { invalid, className = "", children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`
          w-full appearance-none rounded-2xl bg-white/[0.03] border px-4 py-3 pr-10 text-sm text-textMain
          backdrop-blur-xl transition-all duration-300 outline-none cursor-pointer
          focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(194,65,12,0.25)]
          ${invalid ? "border-red-500/50 focus:border-red-500/70" : "border-white/10 focus:border-primary/60"}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
    </div>
  );
});

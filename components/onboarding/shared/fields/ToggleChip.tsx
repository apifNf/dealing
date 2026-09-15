import type { InputHTMLAttributes } from "react";

type ToggleChipProps = {
  label: string;
  selected: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export function ToggleChip({ label, selected, inputProps }: ToggleChipProps) {
  return (
    <label
      className={`
        inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5
        text-sm font-medium backdrop-blur-2xl transition-all duration-300
        ${
          selected
            ? "border-primary/60 bg-primary/15 text-white shadow-[0_0_20px_rgba(194,65,12,0.2)]"
            : "border-white/10 bg-white/[0.015] text-textMuted hover:border-white/20 hover:text-textMain"
        }
      `}
    >
      <input type="checkbox" className="sr-only" {...inputProps} />
      {label}
    </label>
  );
}

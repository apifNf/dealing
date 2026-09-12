import type { InputHTMLAttributes, ReactNode } from "react";

type SelectableCardProps = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export function SelectableCard({ id, label, description, icon, selected, inputProps }: SelectableCardProps) {
  return (
    <label
      htmlFor={id}
      className={`
        group relative block cursor-pointer rounded-2xl border p-6 backdrop-blur-xl
        transition-all duration-300
        ${
          selected
            ? "border-primary/60 bg-primary/[0.08] shadow-[0_0_30px_rgba(194,65,12,0.25)]"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        }
      `}
    >
      <input id={id} type="radio" className="sr-only" {...inputProps} />
      {icon && (
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ${
            selected ? "bg-primary/20 text-primary" : "bg-white/5 text-textMuted"
          }`}
        >
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-white">{label}</h4>
      {description && <p className="mt-1 text-xs text-textMuted leading-relaxed">{description}</p>}
    </label>
  );
}

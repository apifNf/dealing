import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type WizardShellProps = {
  title: string;
  description?: string;
  onBack?: () => void;
  progress?: ReactNode;
  children: ReactNode;
};

export function WizardShell({ title, description, onBack, progress, children }: WizardShellProps) {
  return (
    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-surfaceGlass p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-10">
      <div className="mb-8 flex flex-col gap-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex w-fit items-center gap-2 text-xs font-medium text-textMuted transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </button>
        )}
        {progress}
        <div>
          <h2 className="font-serif text-2xl text-white sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 text-sm leading-relaxed text-textMuted">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

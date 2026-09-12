type StepProgressProps = {
  steps: string[];
  currentIndex: number;
};

export function StepProgress({ steps, currentIndex }: StepProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-1 flex-col gap-2">
          <div
            className={`h-1 w-full rounded-full transition-all duration-500 ${
              index <= currentIndex ? "bg-primary" : "bg-white/10"
            }`}
          />
          <span
            className={`hidden text-[10px] font-medium uppercase tracking-wider sm:block ${
              index <= currentIndex ? "text-primary" : "text-textMuted/50"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

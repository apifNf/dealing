import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Onboarding | DEALING",
  description: "Mulai perjalanan Anda di DEALING — jual aset digital atau temukan deal flow akuisisi terbaik.",
};

export default function OnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[10%] -left-[20%] h-[35%] w-[150%] animate-[wave-drift-1_7s_ease-in-out_infinite] bg-primary/15 blur-[120px]" />
        <div className="absolute top-[35%] -right-[20%] h-[25%] w-[150%] animate-[wave-drift-2_9s_ease-in-out_infinite] bg-amber-600/10 blur-[100px]" />
        <div className="absolute -bottom-[15%] -left-[10%] h-[30%] w-[120%] animate-[wave-drift-3_11s_ease-in-out_infinite] bg-primary/15 blur-[120px]" />
        <div className="absolute inset-0 bg-background/20 mix-blend-overlay" />
      </div>
      <div className="relative z-10">
        <OnboardingFlow />
      </div>
    </main>
  );
}

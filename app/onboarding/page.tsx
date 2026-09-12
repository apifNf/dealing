import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { PageBackground } from "@/components/shared/PageBackground";

export const metadata: Metadata = {
  title: "Onboarding | DEALING",
  description: "Mulai perjalanan Anda di DEALING — jual aset digital atau temukan deal flow akuisisi terbaik.",
};

export default function OnboardingPage() {
  return (
    <PageBackground>
      <OnboardingFlow />
    </PageBackground>
  );
}

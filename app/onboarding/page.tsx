import type { Metadata } from "next";
import { OnboardingFlow, type OnboardingIntent } from "@/components/onboarding/OnboardingFlow";
import { PageBackground } from "@/components/shared/PageBackground";

export const metadata: Metadata = {
  title: "Onboarding | DEALING",
  description: "Mulai perjalanan Anda di DEALING — jual aset digital atau temukan deal flow akuisisi terbaik.",
};

type OnboardingPageProps = {
  searchParams: Promise<{ intent?: string }>;
};

function parseIntent(value: string | undefined): OnboardingIntent | null {
  return value === "sell" || value === "buy" ? value : null;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { intent } = await searchParams;

  return (
    <PageBackground>
      <OnboardingFlow initialIntent={parseIntent(intent)} />
    </PageBackground>
  );
}

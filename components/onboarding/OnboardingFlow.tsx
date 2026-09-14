"use client";

import { useState } from "react";
import { IntentStep } from "./IntentStep";
import { SellerWizard } from "./SellerWizard";
import { BuyerWizard } from "./BuyerWizard";

export type OnboardingIntent = "sell" | "buy";

type OnboardingFlowProps = {
  initialIntent?: OnboardingIntent | null;
};

export function OnboardingFlow({ initialIntent = null }: OnboardingFlowProps) {
  const [intent, setIntent] = useState<OnboardingIntent | null>(initialIntent);

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-4 py-16">
      <div key={intent ?? "intent"} className="animate-step-in flex w-full justify-center">
        {intent === null && <IntentStep onSelect={setIntent} />}
        {intent === "sell" && <SellerWizard onExit={() => setIntent(null)} />}
        {intent === "buy" && <BuyerWizard onExit={() => setIntent(null)} />}
      </div>
    </div>
  );
}

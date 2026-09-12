import { Code2, Globe, Video } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { ASSET_CATEGORIES, type SellerFormValues } from "@/lib/validations/onboarding";
import { SelectableCard } from "../shared/fields/SelectableCard";

const CATEGORY_ICONS = {
  content: Video,
  website: Globe,
  saas: Code2,
} as const;

type CategoryPhaseProps = {
  form: UseFormReturn<SellerFormValues>;
};

export function CategoryPhase({ form }: CategoryPhaseProps) {
  const { register, watch, formState } = form;
  const selected = watch("category");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ASSET_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.value];
          return (
            <SelectableCard
              key={category.value}
              id={`category-${category.value}`}
              label={category.label}
              description={category.description}
              icon={<Icon className="h-5 w-5" />}
              selected={selected === category.value}
              inputProps={{ ...register("category"), value: category.value }}
            />
          );
        })}
      </div>
      {formState.errors.category && (
        <p className="text-xs text-red-400" role="alert">
          Pilih salah satu kategori untuk melanjutkan
        </p>
      )}
    </div>
  );
}

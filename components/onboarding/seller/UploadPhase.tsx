import type { UseFormReturn } from "react-hook-form";
import type { SellerFormValues } from "@/lib/validations/onboarding";
import { DropzoneUpload } from "../shared/fields/DropzoneUpload";

type UploadPhaseProps = {
  form: UseFormReturn<SellerFormValues>;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function UploadPhase({ form, files, onFilesChange }: UploadPhaseProps) {
  const handleChange = (next: File[]) => {
    onFilesChange(next);
    form.setValue(
      "fileNames",
      next.map((file) => file.name),
      { shouldValidate: true }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <DropzoneUpload value={files} onChange={handleChange} />
      <p className="text-xs text-textMuted">
        Opsional, namun listing dengan bukti analytics memiliki tingkat konversi jauh lebih tinggi.
      </p>
    </div>
  );
}

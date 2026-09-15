"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileImage, X } from "lucide-react";

type DropzoneUploadProps = {
  value: File[];
  onChange: (files: File[]) => void;
};

export function DropzoneUpload({ value, onChange }: DropzoneUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    onChange([...value, ...Array.from(fileList)]);
  };

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`
          flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed
          px-6 py-12 text-center backdrop-blur-2xl transition-all duration-300
          ${isDragging ? "border-primary/70 bg-primary/[0.06]" : "border-white/15 bg-white/[0.015] hover:border-white/30"}
        `}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="text-sm text-textMain">
          <span className="font-semibold text-primary">Klik untuk upload</span> atau drag & drop
        </p>
        <p className="text-xs text-textMuted">
          Screenshot analytics, dashboard revenue, atau bukti traffic (PNG, JPG, PDF)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileImage className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm text-textMain">{file.name}</span>
                <span className="shrink-0 text-xs text-textMuted">{(file.size / 1024).toFixed(0)} KB</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 rounded-full p-1 text-textMuted transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`Hapus ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

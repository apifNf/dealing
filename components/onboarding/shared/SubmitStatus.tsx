import { CheckCircle2, AlertCircle } from "lucide-react";

type SubmitStatusProps = {
  status: "success" | "error";
  message: string;
};

export function SubmitStatus({ status, message }: SubmitStatusProps) {
  const isSuccess = status === "success";
  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm backdrop-blur-xl ${
        isSuccess
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {isSuccess ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
      <p>{message}</p>
    </div>
  );
}

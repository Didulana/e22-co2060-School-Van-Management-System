import { cn } from "./ui/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-slate-50 text-slate-600 border-slate-200",
};

const dotStyles: Record<StatusType, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-slate-400",
};

export function StatusBadge({ status, children, className, dot = true }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
        statusStyles[status],
        className
      )}
    >
      {dot && <span className={cn("size-2 rounded-full", dotStyles[status])} />}
      {children}
    </span>
  );
}

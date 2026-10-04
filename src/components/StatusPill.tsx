import { AlertTriangle, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import type { DataQuality } from "@/lib/operations";
import { cn } from "@/lib/utils";

const meta = {
  healthy: { Icon: CheckCircle2, cls: "bg-success-soft text-success", dot: "bg-success" },
  warning: { Icon: AlertTriangle, cls: "bg-warning-soft text-warning", dot: "bg-warning" },
  critical: { Icon: XCircle, cls: "bg-danger-soft text-danger", dot: "bg-danger" },
  unknown: { Icon: CircleHelp, cls: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};
export function StatusPill({ state, label, compact = false }: { state: DataQuality; label: string; compact?: boolean }) {
  const { Icon, cls, dot } = meta[state];
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap", cls)}>{compact ? <span className={cn("h-1.5 w-1.5 rounded-full", dot)} /> : <Icon className="h-3 w-3" />}{label}</span>;
}

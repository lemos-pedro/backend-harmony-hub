import { Activity, AlertTriangle, DatabaseZap, RadioTower } from "lucide-react";
import type { TowerView } from "@/lib/operations";
const items = (towers: TowerView[]) => {
  const failed = towers.filter((t) => t.observedState === "critical").length;
  const never = towers.filter((t) => !t.last_successful_at).length;
  const valid = towers.filter((t) => t.availabilityValid).map((t) => t.availability_30d as number);
  const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : undefined;
  return [
    { label: "Sites monitorizados", value: towers.length, note: `${new Set(towers.map((t) => t.region_id)).size} regiões`, Icon: RadioTower, tone: "text-primary bg-info-soft" },
    { label: "Exigem intervenção", value: failed, note: "falha ou sem comunicação", Icon: AlertTriangle, tone: "text-danger bg-danger-soft" },
    { label: "Nunca recolhidos", value: never, note: "sem histórico confirmado", Icon: DatabaseZap, tone: "text-warning bg-warning-soft" },
    { label: "Disponibilidade válida", value: avg === undefined ? "—" : `${avg.toFixed(1)}%`, note: `${valid.length} sites elegíveis`, Icon: Activity, tone: "text-success bg-success-soft" },
  ];
};
export function FleetKpis({ towers }: { towers: TowerView[] }) { return <section className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">{items(towers).map(({ label, value, note, Icon, tone }) => <article key={label} className="bg-card p-4"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-2 font-mono text-2xl font-semibold">{value}</p></div><span className={`grid h-8 w-8 place-items-center rounded-md ${tone}`}><Icon className="h-4 w-4"/></span></div><p className="mt-2 text-[11px] text-muted-foreground">{note}</p></article>)}</section>; }

import type { ApiMetric, ApiOperator, ApiRegion, ApiTower } from "./api";

export type DataQuality = "healthy" | "warning" | "critical" | "unknown";
export interface TowerView extends ApiTower {
  regionName: string; operatorNames: string[]; observedState: DataQuality; observedLabel: string;
  hasCoordinates: boolean; availabilityValid: boolean;
}

const invalidDate = (value?: string) => !value || value.startsWith("0001-01-01");
export const formatDateTime = (value?: string) => {
  if (invalidDate(value)) return "Não reportado";
  const date = new Date(value ?? "");
  return Number.isNaN(date.getTime()) ? "Não reportado" : new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
};
export const relativeTime = (value?: string) => {
  if (invalidDate(value)) return "Nunca recolhido";
  const diff = Date.now() - new Date(value ?? "").getTime();
  if (Number.isNaN(diff)) return "Não reportado";
  const mins = Math.max(0, Math.round(diff / 60000));
  if (mins < 60) return `há ${mins} min`;
  if (mins < 1440) return `há ${Math.round(mins / 60)} h`;
  return `há ${Math.round(mins / 1440)} d`;
};
export const validAvailability = (tower: ApiTower) => tower.last_successful_at ? tower.availability_30d : undefined;
export const formatPercent = (value?: number) => value === undefined || !Number.isFinite(value) ? "Sem dados" : `${value.toFixed(1)}%`;
export function toTowerView(tower: ApiTower, regions: ApiRegion[] = [], operators: ApiOperator[] = []): TowerView {
  const region = regions.find((item) => item.region_id === tower.region_id);
  const legacyOperator = operators.find((item) => item.operator_id === tower.operator_id);
  const operatorNames = tower.operators?.map((item) => item.name).filter(Boolean) ?? (legacyOperator ? [legacyOperator.name] : []);
  const neverCollected = !tower.last_successful_at;
  const failed = Boolean(tower.last_collection_error) || /fail|error/i.test(tower.collection_status ?? "");
  return {
    ...tower,
    regionName: region?.name ?? "Região não identificada",
    operatorNames,
    observedState: failed ? "critical" : neverCollected ? "unknown" : tower.status === "offline" ? "critical" : tower.status === "degraded" ? "warning" : "healthy",
    observedLabel: failed ? "Falha na recolha" : neverCollected ? "Nunca recolhido" : tower.status === "offline" ? "Sem comunicação" : tower.status === "degraded" ? "Atenção" : "Operacional",
    hasCoordinates: typeof tower.latitude === "number" && typeof tower.longitude === "number",
    availabilityValid: Boolean(tower.last_successful_at) && typeof tower.availability_30d === "number",
  };
}
export function latestMetric(metrics: ApiMetric[]) { return [...metrics].sort((a, b) => b.collected_at.localeCompare(a.collected_at))[0]; }
export function metricNumber(metric: ApiMetric | undefined, ...keys: string[]) {
  for (const key of keys) { const value = metric?.metrics[key]; if (typeof value === "number" && Number.isFinite(value)) return value; }
  return undefined;
}
export function safeTemperature(value?: number) { return value === undefined || value === 0 || value < -40 || value > 85 ? undefined : value; }
export function metricGroups(vendor: string) {
  const key = vendor.toLowerCase();
  if (key.includes("huawei")) return ["Energia DC", "Bateria"];
  if (key.includes("enetek")) return ["Rede AC", "Sistema", "Bateria"];
  if (key.includes("eltek")) return ["Rede AC", "Retificadores", "Bateria", "Sistema"];
  return [];
}

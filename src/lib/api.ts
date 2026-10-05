export type TowerStatus = "online" | "degraded" | "offline";
export type AlarmSeverity = "info" | "warning" | "critical";
export type EventType = "failure" | "alarm" | "maintenance" | "recovery";
export type TicketStatus = "open" | "acknowledged" | "closed";

export interface ApiTowerOperator { operator_id: string; name: string; code: string }
export interface ApiTower {
  tower_id: string; name: string; status: TowerStatus; operator_id?: string; operators?: ApiTowerOperator[];
  region_id: string; vendor: string; collection_status?: string; last_collected_at?: string;
  last_successful_at?: string; last_collection_error?: string; snmp_enabled: boolean;
  snmp_version: "v2c" | "v3"; snmp_target?: string; latitude?: number; longitude?: number;
  NetecoEnabled?: boolean; NetecoNEID?: string; NetecoSiteName?: string;
  dc_output_voltage?: number; dc_load_current?: number; rectifier_current?: number;
  battery_soc?: number; battery_soh?: number; battery_backup_time_h?: number; battery_updated_at?: string;
  availability_30d?: number; availability_7d?: number; updated_at: string; created_at: string;
  [key: string]: unknown;
}
export interface ApiMetric { metric_id: string; tower_id: string; collected_at: string; created_at: string; metrics: Record<string, number | string | boolean | null> }
export interface ApiEvent { event_id: string; tower_id: string; type: EventType; severity: AlarmSeverity; message: string; status?: "open" | "resolved"; occurred_at: string; created_at: string }
export interface ApiTicket { ticket_id: string; tower_id: string; tower_name?: string; event_id: string; status: TicketStatus; acknowledged_at?: string; closed_at?: string; created_at: string; updated_at: string }
export interface ApiOperator { operator_id: string; name: string; code: string; created_at: string; updated_at: string }
export interface ApiRegion { region_id: string; name: string; latitude?: number; longitude?: number; [key: string]: unknown }
export interface ApiGeneratorReading { TowerID?: string; tower_id?: string; FuelLiters?: number; fuel_liters?: number; FuelPercent?: number; fuel_percent?: number; BatteryVoltageV?: number; battery_voltage_v?: number; RunHoursTotal?: number; run_hours_total?: number; RPM?: number; rpm?: number; FrequencyHz?: number; frequency_hz?: number; EngineTempC?: number; engine_temp_c?: number; CollectedAt?: string; collected_at?: string }
export interface Paginated<T> { data: T[]; meta: { limit: number; offset: number; total: number } }

const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] || "https://careless-deplored-lure.ngrok-free.dev").replace(/\/$/, "");
const tokenKey = "antosc.api.token";

async function request<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => value !== undefined && value !== "" && url.searchParams.set(key, String(value)));
  const token = typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;
  const response = await fetch(url, { headers: { "ngrok-skip-browser-warning": "true", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (!response.ok) throw new Error(response.status === 404 ? "O endereço da API não está disponível." : `A API respondeu com o estado ${response.status}.`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new Error("A API devolveu uma resposta inesperada.");
  return response.json() as Promise<T>;
}
async function paginated<T>(path: string, query?: Record<string, string | number | undefined>): Promise<Paginated<T>> {
  const result = await request<T[] | Paginated<T>>(path, query);
  if (Array.isArray(result)) return { data: result, meta: { limit: result.length, offset: 0, total: result.length } };
  return result;
}

export const api = {
  listTowers: (q?: Record<string, string | number | undefined>) => paginated<ApiTower>("/api/v1/towers", q),
  getTower: (id: string) => request<ApiTower>(`/api/v1/towers/${encodeURIComponent(id)}`),
  listRegions: () => paginated<ApiRegion>("/api/v1/regions", { limit: 500 }),
  listOperators: () => paginated<ApiOperator>("/api/v1/operators", { limit: 500 }),
  listMetrics: (towerId?: string, limit = 100) => paginated<ApiMetric>("/api/v1/metrics", { tower_id: towerId, limit }),
  listTowerEvents: (towerId: string, status?: "open" | "resolved") => paginated<ApiEvent>(`/api/v1/towers/${encodeURIComponent(towerId)}/events`, { status, limit: 100 }),
  listTickets: () => paginated<ApiTicket>("/api/v1/tickets", { limit: 200 }),
  getTowerGenerator: (towerId: string) => request<ApiGeneratorReading>(`/api/v1/towers/${encodeURIComponent(towerId)}/energy/generator`),
};

export const queryKeys = {
  towers: ["towers"] as const, regions: ["regions"] as const, operators: ["operators"] as const,
  tower: (id: string) => ["tower", id] as const, metrics: (id: string) => ["metrics", id] as const,
  events: (id: string) => ["events", id] as const, generator: (id: string) => ["generator", id] as const,
};

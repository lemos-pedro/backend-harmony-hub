import { queryOptions } from "@tanstack/react-query";
import { api, queryKeys } from "./api";
export const towersQuery = queryOptions({ queryKey: queryKeys.towers, queryFn: () => api.listTowers({ limit: 500 }), staleTime: 30_000 });
export const regionsQuery = queryOptions({ queryKey: queryKeys.regions, queryFn: api.listRegions, staleTime: 300_000 });
export const operatorsQuery = queryOptions({ queryKey: queryKeys.operators, queryFn: api.listOperators, staleTime: 300_000 });
export const towerQuery = (id: string) => queryOptions({ queryKey: queryKeys.tower(id), queryFn: () => api.getTower(id), staleTime: 15_000 });
export const metricsQuery = (id: string) => queryOptions({ queryKey: queryKeys.metrics(id), queryFn: () => api.listMetrics(id), staleTime: 15_000 });
export const eventsQuery = (id: string) => queryOptions({ queryKey: queryKeys.events(id), queryFn: () => api.listTowerEvents(id), staleTime: 15_000 });

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, BellRing, Building2, FileDown, Map, Menu, RadioTower, Search, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Visão geral", Icon: Activity }, { to: "/torres", label: "Sites", Icon: RadioTower },
  { to: "/alarmes", label: "Alarmes", Icon: BellRing }, { to: "/mapa", label: "Mapa", Icon: Map },
  { to: "/operadores", label: "Operadores", Icon: UsersRound }, { to: "/relatorios", label: "Relatórios", Icon: FileDown },
] as const;
const titles: Record<string, [string, string]> = {
  "/": ["Visão geral", "Estado operacional do parque"], "/torres": ["Sites", "Inventário e qualidade da recolha"],
  "/alarmes": ["Alarmes", "Ocorrências que exigem atenção"], "/mapa": ["Mapa operacional", "Distribuição geográfica dos sites"],
  "/operadores": ["Operadores", "Cobertura por operador de rede"], "/relatorios": ["Relatórios", "Exportações operacionais verificadas"],
};
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const base = path.startsWith("/torres/") ? "/torres" : path;
  const [title, subtitle] = titles[base] ?? ["ANTOSC", "Centro de operações"];
  return <div className="min-h-screen bg-background lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
    {open && <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={cn("fixed inset-y-0 left-0 z-40 w-[232px] border-r border-sidebar-border bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5"><Link to="/" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground"><Building2 className="h-4 w-4" /></span><span><strong className="block text-sm tracking-[0.16em]">ANTOSC</strong><small className="block text-[9px] uppercase text-muted-foreground">Network Operations</small></span></Link><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X /></Button></div>
      <div className="px-3 py-5"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Operação</p><nav className="space-y-1">{navigation.map(({ to, label, Icon }) => <Link key={to} to={to} activeOptions={{ exact: to === "/" }} onClick={() => setOpen(false)} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" }}><Icon className="h-4 w-4" />{label}</Link>)}</nav></div>
      <div className="absolute inset-x-3 bottom-4 rounded-md border border-sidebar-border bg-background/60 p-3"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning"/><span className="text-xs font-semibold">Fonte operacional</span></div><p className="mt-1 text-[10px] text-muted-foreground">A disponibilidade é validada em cada consulta.</p></div>
    </aside>
    <div className="min-w-0"><header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-7"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu /></Button><div className="min-w-0 flex-1"><h1 className="truncate text-base font-semibold">{title}</h1><p className="hidden text-xs text-muted-foreground sm:block">{subtitle}</p></div><form className="relative hidden w-64 md:block" onSubmit={(event) => { event.preventDefault(); navigate({ to: "/torres", search: { q: query, state: "all", vendor: "all", region: "all", page: 1 } }); }}><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 bg-card pl-9 text-xs" placeholder="Pesquisar site..." aria-label="Pesquisar site" /></form><Button asChild variant="outline" size="icon"><Link to="/alarmes" aria-label="Alarmes"><BellRing /></Link></Button><div className="hidden h-9 items-center gap-2 border-l border-border pl-4 sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">OC</span><div><p className="text-xs font-semibold">Centro NOC</p><p className="text-[10px] text-muted-foreground">Operações</p></div></div></header><main className="mx-auto max-w-[1600px] p-4 md:p-7">{children}</main></div>
  </div>;
}

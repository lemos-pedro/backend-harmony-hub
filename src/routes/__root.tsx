import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { type ReactNode } from "react";
import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "theme-color", content: "#f5f7f8" }], links: [{ rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&display=swap" }, { rel: "stylesheet", href: appCss }, { rel: "icon", href: "/favicon.ico" }] }),
  shellComponent: RootShell, component: RootComponent, notFoundComponent: NotFound, errorComponent: RootError,
});
function RootShell({ children }: { children: ReactNode }) { return <html lang="pt"><head><HeadContent/></head><body>{children}<Scripts/></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><AppShell><Outlet/></AppShell></QueryClientProvider>; }
function NotFound() { return <div className="grid min-h-[60vh] place-items-center text-center"><div><p className="font-mono text-sm text-primary">404</p><h1 className="mt-2 text-2xl font-bold">Página não encontrada</h1><p className="mt-2 text-sm text-muted-foreground">Este endereço não faz parte do centro operacional.</p><Button asChild className="mt-5"><Link to="/">Voltar à visão geral</Link></Button></div></div>; }
function RootError({ error, reset }: ErrorComponentProps) { const router = useRouter(); return <div className="grid min-h-screen place-items-center p-6"><div className="max-w-md text-center"><h1 className="text-xl font-bold">Não foi possível abrir esta página</h1><p className="mt-2 text-sm text-muted-foreground">{error.message}</p><Button className="mt-5" onClick={() => { router.invalidate(); reset(); }}>Tentar novamente</Button></div></div>; }

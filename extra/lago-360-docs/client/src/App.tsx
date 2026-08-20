/** Design: Atlas de Operação — a aplicação entrega uma única superfície documental contínua. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const Coverage = lazy(() => import("./pages/Coverage"));
const DomainGuide = lazy(() => import("./pages/DomainGuide"));

function Router() {
  return <Suspense fallback={<main className="min-h-screen bg-[#edf0ea] p-8 font-mono text-xs text-[#0e5968]">Carregando dossiê…</main>}><Switch><Route path="/" component={Home} /><Route path="/coverage" component={Coverage} /><Route path="/docs/:slug" component={DomainGuide} /><Route component={NotFound} /></Switch></Suspense>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

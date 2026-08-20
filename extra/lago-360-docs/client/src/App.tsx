/** Design: Atlas de Operação — a aplicação entrega uma única superfície documental contínua. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DocumentationSearch from "./components/DocumentationSearch";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const Coverage = lazy(() => import("./pages/Coverage"));
const DomainGuide = lazy(() => import("./pages/DomainGuide"));

function Router() {
  const [location] = useLocation();
  const reduceMotion = useReducedMotion();
  return <AnimatePresence mode="wait" initial={false}><motion.div key={location} className="route-transition" initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -4 }} transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}><Suspense fallback={<main className="docs-loading" aria-live="polite"><div className="docs-loading-mark" /><span>CARREGANDO DOCUMENTAÇÃO</span><i /><i /><i /></main>}><Switch><Route path="/" component={Home} /><Route path="/coverage" component={Coverage} /><Route path="/docs/:slug" component={DomainGuide} /><Route component={NotFound} /></Switch></Suspense></motion.div></AnimatePresence>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><DocumentationSearch /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

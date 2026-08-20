import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, FileCode2, Filter, Route, Search, SlidersHorizontal } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { documentationFilterOptions, documentationIndex, type DocumentationEntry, type DocumentationEntryKind } from "@/data/documentationIndex";

const OPEN_DOCUMENTATION_SEARCH = "lago:open-documentation-search";

export function openDocumentationSearch() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_DOCUMENTATION_SEARCH));
}

function ResultIcon({ kind }: { kind: DocumentationEntryKind }) {
  return kind === "Guia" ? <BookOpen size={16} /> : kind === "Operação" ? <FileCode2 size={16} /> : <Route size={16} />;
}

export default function DocumentationSearch() {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("Todos");
  const [stage, setStage] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [method, setMethod] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_DOCUMENTATION_SEARCH, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_DOCUMENTATION_SEARCH, onOpen);
    };
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return documentationIndex.filter((entry) => {
      const text = `${entry.title} ${entry.detail} ${entry.domain} ${entry.flowStage} ${entry.kind} ${entry.method ?? ""}`.toLocaleLowerCase("pt-BR");
      return (!normalized || text.includes(normalized))
        && (domain === "Todos" || entry.domain === domain)
        && (stage === "Todos" || entry.flowStage === stage)
        && (status === "Todos" || entry.status === status)
        && (method === "Todos" || entry.method === method);
    });
  }, [domain, method, query, stage, status]);

  const groupedResults = (["Guia", "Rota", "Operação"] as DocumentationEntryKind[]).map((kind) => ({ kind, entries: results.filter((entry) => entry.kind === kind) })).filter((group) => group.entries.length);
  const activeFilterCount = [domain, stage, status, method].filter((value) => value !== "Todos").length;
  const resetFilters = () => { setDomain("Todos"); setStage("Todos"); setStatus("Todos"); setMethod("Todos"); };

  const navigateTo = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      setLocation("/");
      window.setTimeout(() => document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return;
    }
    setLocation(href);
  };

  const filterGroups = [
    { label: "Domínio", values: documentationFilterOptions.domains, selected: domain, setSelected: setDomain },
    { label: "Estágio", values: documentationFilterOptions.stages, selected: stage, setSelected: setStage },
    { label: "Cobertura", values: documentationFilterOptions.statuses, selected: status, setSelected: setStatus },
    { label: "Método", values: documentationFilterOptions.methods, selected: method, setSelected: setMethod },
  ];

  return <CommandDialog open={open} onOpenChange={setOpen} title="Buscar na documentação" description="Localize guias, rotas e operações da documentação Lago 360º." className="route-search-dialog">
    <div className="route-search-title"><div><span><Search size={15} />BUSCA DE DOCUMENTAÇÃO</span><strong>Encontre uma rota, guia ou operação.</strong></div><button type="button" onClick={() => setShowFilters((value) => !value)} className={showFilters ? "is-active" : ""}><SlidersHorizontal size={15} />Filtros{activeFilterCount ? ` · ${activeFilterCount}` : ""}</button></div>
    <CommandInput value={query} onValueChange={setQuery} placeholder="Ex.: /plans, assinaturas, POST, faturas…" />
    {showFilters && <div className="route-search-filters" aria-label="Filtros avançados">{filterGroups.map((group) => <fieldset key={group.label}><legend>{group.label}</legend><div>{group.values.map((value) => <button type="button" key={value} onClick={() => group.setSelected(value)} className={group.selected === value ? "is-active" : ""}>{value}</button>)}</div></fieldset>)}{activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="route-search-reset"><Filter size={13} />Limpar filtros</button>}</div>}
    <CommandList>
      <CommandEmpty>Nenhuma rota ou operação corresponde aos filtros selecionados.</CommandEmpty>
      {groupedResults.map((group, index) => <div key={group.kind}>{index > 0 && <CommandSeparator />}<CommandGroup heading={`${group.kind}s · ${group.entries.length}`}>{group.entries.map((entry) => <CommandItem key={entry.id} value={`${entry.title} ${entry.detail} ${entry.domain}`} onSelect={() => navigateTo(entry.href)} className="route-search-item"><ResultIcon kind={entry.kind} /><div><strong>{entry.title}</strong><span>{entry.detail}</span></div><small>{entry.method ?? entry.domain}</small></CommandItem>)}</CommandGroup></div>)}
    </CommandList>
    <div className="route-search-footer"><span>{results.length} resultado{results.length === 1 ? "" : "s"}</span><CommandShortcut>↵ abrir</CommandShortcut><CommandShortcut>esc fechar</CommandShortcut></div>
  </CommandDialog>;
}

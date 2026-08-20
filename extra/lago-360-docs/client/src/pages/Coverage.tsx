/**
 * Design: Atlas de Operação — a matriz atua como painel de controle: sem cartões genéricos,
 * com evidência, estágio causal e status visível para orientar a próxima implementação.
 */
import { Link } from "wouter";
import { ArrowUpRight, CheckCircle2, CircleDotDashed, FileStack, Map, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { coverageCounts, coverageDomains, type CoverageStatus } from "@/data/coverage";

const filters: Array<CoverageStatus | "Todos"> = ["Todos", "Em implementação", "Mapeado", "Planejado"];

function statusClass(status: CoverageStatus) {
  return status === "Em implementação" ? "bg-[#d8ff64] text-[#173137]" : status === "Mapeado" ? "bg-[#dceff1] text-[#0e5968]" : "bg-[#ebe9df] text-[#526462]";
}

export default function Coverage() {
  const [filter, setFilter] = useState<CoverageStatus | "Todos">("Todos");
  const [query, setQuery] = useState("");
  const visibleDomains = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return coverageDomains.filter((domain) => {
      const matchesStatus = filter === "Todos" || domain.status === filter;
      const matchesSearch = !normalizedQuery || `${domain.title} ${domain.contractFocus} ${domain.scope}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      return matchesStatus && matchesSearch;
    });
  }, [filter, query]);

  return (
    <div className="atlas-app">
      <aside className="atlas-sidebar" aria-label="Navegação da matriz de cobertura">
        <Link href="/" className="brand-lockup no-underline text-inherit">
          <div className="brand-mark"><span /><i /></div>
          <div><span className="brand-name">Lago</span><span className="brand-sub">Atlas de cobertura 360º</span></div>
        </Link>
        <nav className="sidebar-nav" aria-label="Navegação da documentação">
          <Link href="/" className="nav-link"><Map size={16} strokeWidth={1.8} /><span>Atlas operacional</span><ArrowUpRight size={14} /></Link>
          <Link href="/coverage" className="nav-link bg-white/10 text-white"><FileStack size={16} strokeWidth={1.8} /><span>Matriz 360º</span><ArrowUpRight size={14} /></Link>
        </nav>
        <div className="sidebar-dossier">
          <span>CONTROLE DE COBERTURA</span>
          <strong>{coverageDomains.length} domínios</strong>
          <p>{coverageCounts["Em implementação"]} em implementação · {coverageCounts.Mapeado} mapeados · {coverageCounts.Planejado} planejados.</p>
          <a href="#matriz" className="flex min-h-[37px] items-center justify-center gap-2 border border-[#d8ff64]/70 text-[11px] font-medium tracking-wide text-[#d8ff64]"><Search size={14} />Filtrar cobertura</a>
        </div>
      </aside>

      <main className="atlas-main">
        <header className="topline"><div><span className="live-dot" />Matriz de execução</div><div className="topline-meta">OPENAPI · GUIA · SDK · TESTE · FONTE</div></header>
        <section className="px-[70px] pb-16 pt-[74px] max-[1000px]:px-[38px] max-[680px]:px-[22px]">
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(270px,.8fr)] items-end gap-12 max-[900px]:grid-cols-1">
            <div>
              <p className="eyebrow">Controle de trabalho / cobertura 360º</p>
              <h1 className="mt-4 max-w-[760px] font-[Space_Grotesk] text-[clamp(48px,6vw,82px)] font-bold leading-[.88] tracking-[-.075em]">Do contrato<br />ao <em className="not-italic text-[#0e5968]">próximo</em><br />merge.</h1>
            </div>
            <p className="mb-1 max-w-[400px] text-[17px] leading-[1.45] text-[#4d6060]">Cada domínio declara o que já possui evidência, o que ainda é mapeamento e a ação técnica que torna a cobertura implementável.</p>
          </div>
          <div className="mt-12 grid grid-cols-3 border-y border-[#c3cec8] max-[680px]:grid-cols-1" aria-label="Resumo da cobertura">
            {(["Em implementação", "Mapeado", "Planejado"] as CoverageStatus[]).map((status) => <div className="min-h-[126px] border-r border-[#c3cec8] px-6 py-5 last:border-r-0 max-[680px]:border-b max-[680px]:last:border-b-0" key={status}><span className="font-mono text-[10px] tracking-[.08em] text-[#5d7571]">{status.toUpperCase()}</span><strong className="mt-3 block font-[Space_Grotesk] text-5xl leading-none tracking-[-.08em] text-[#0e5968]">{coverageCounts[status]}</strong><span className="mt-3 block max-w-[170px] font-mono text-[11px] leading-tight text-[#526462]">domínios no estágio atual</span></div>)}
          </div>
        </section>

        <section id="matriz" className="border-t border-[#c3cec8] bg-[#e1e8e3] px-[70px] py-[70px] max-[1000px]:px-[38px] max-[680px]:px-[22px]">
          <div className="mb-10 grid grid-cols-[minmax(0,1fr)_300px] items-end gap-8 max-[850px]:grid-cols-1">
            <div><p className="eyebrow">Mapa de domínio</p><h2 className="mt-3 max-w-[760px] font-[Space_Grotesk] text-5xl font-bold leading-[.96] tracking-[-.06em]">Priorize por evidência, não por impressão.</h2></div>
            <label className="grid min-h-10 grid-cols-[20px_minmax(0,1fr)] items-center gap-2 border-b-2 border-[#0e5968] text-[#0e5968]"><Search size={17} /><input className="min-w-0 border-0 bg-transparent text-[15px] outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar domínio ou contrato" aria-label="Buscar domínio de cobertura" /></label>
          </div>
          <div className="mb-7 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar status de cobertura">
            {filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`min-h-8 border px-3 font-mono text-[11px] ${filter === item ? "border-[#0e5968] bg-[#0e5968] text-[#f8faf5]" : "border-[#aebfba] bg-transparent text-[#46605e]"}`}>{item}</button>)}
          </div>
          <div className="border-t-[5px] border-[#0e5968]">
            {visibleDomains.map((domain) => <article className="grid min-h-[138px] grid-cols-[56px_minmax(160px,.75fr)_minmax(220px,1.2fr)_minmax(160px,.7fr)_42px] items-center gap-5 border-b border-[#bdccc7] px-1 py-5 odd:bg-[#edf1ec] max-[1000px]:grid-cols-[48px_minmax(0,1fr)_42px] max-[1000px]:gap-3" id={domain.slug} key={domain.slug}>
              <span className="grid h-9 w-9 place-items-center bg-[#0e5968] font-mono text-[10px] text-[#f8faf5]">{domain.order}</span>
              <div><span className="font-mono text-[10px] tracking-[.08em] text-[#5b7771]">{domain.flowStage.toUpperCase()}</span><h3 className="mt-1 font-[Space_Grotesk] text-xl font-bold tracking-[-.04em] text-[#153137]">{domain.title}</h3><span className={`mt-3 inline-flex px-2 py-1 font-mono text-[10px] ${statusClass(domain.status)}`}>{domain.status}</span></div>
              <p className="text-[14px] leading-[1.38] text-[#506361] max-[1000px]:col-start-2">{domain.contractFocus}</p>
              <p className="font-mono text-[11px] leading-[1.38] text-[#526462] max-[1000px]:col-start-2">PRÓXIMA AÇÃO · {domain.nextTask}</p>
              <Link href={`/docs/${domain.slug}`} aria-label={`Abrir guia de ${domain.title}`} className="grid h-9 w-9 place-items-center border border-[#0e5968] text-[#0e5968] transition-colors hover:bg-[#d8ff64]"><ArrowUpRight size={17} /></Link>
            </article>)}
            {!visibleDomains.length && <div className="py-12 text-[16px] text-[#526462]">Nenhum domínio corresponde ao filtro. Tente remover os termos ou selecionar outro estágio.</div>}
          </div>
        </section>
        <footer className="atlas-footer"><span>ATLAS DE COBERTURA · LAGO BILLING</span><span>Estados representam evidências disponíveis, não substituem revisão de contrato.</span></footer>
      </main>
    </div>
  );
}

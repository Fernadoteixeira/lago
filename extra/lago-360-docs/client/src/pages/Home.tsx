/**
 * Design: UI oficial do Lago — home clara com hero amplo, documentação grafite,
 * navegação horizontal, busca contextual, CTAs azuis e cards de borda discreta.
 */
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  CircleDollarSign,
  Code2,
  Copy,
  FileCode2,
  FileStack,
  Gauge,
  Layers3,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { openDocumentationSearch } from "@/components/DocumentationSearch";
import { calculateGraduated, calculateVolume } from "@/lib/pricing";

type BatchPanel = "contract" | "response" | "errors";
type ChargeModel = "graduated" | "volume";

const payload = `{
  "events": [
    {
      "transaction_id": "evt-2026-0001",
      "external_subscription_id": "sub-acme-pro",
      "code": "api_calls",
      "timestamp": "1786805400.125",
      "properties": { "requests": 250 }
    }
  ]
}`;

const response = `{
  "events": [
    {
      "transaction_id": "evt-2026-0001",
      "external_subscription_id": "sub-acme-pro",
      "code": "api_calls",
      "lago_customer_id": null
    }
  ]
}`;

const errorResponse = `{
  "errors": {
    "invalid_code": ["evt-2026-0002"],
    "missing_aggregation_property": ["evt-2026-0003"],
    "invalid_filter_values": []
  }
}`;

const domains = ["Todos", "Eventos", "Métricas", "Planos", "Assinaturas", "Faturas", "Pagamentos", "Wallets", "Crédito", "Analytics"] as const;
type Domain = (typeof domains)[number];

const endpoints = [
  { domain: "Eventos", method: "POST", path: "/events", summary: "Registra um único evento de uso." },
  { domain: "Eventos", method: "POST", path: "/events/batch", summary: "Recebe até 100 eventos em uma única requisição." },
  { domain: "Eventos", method: "GET", path: "/events/{transaction_id}", summary: "Consulta um evento pela identidade de transação." },
  { domain: "Métricas", method: "POST", path: "/billable_metrics", summary: "Cria uma regra de agregação de uso." },
  { domain: "Métricas", method: "GET", path: "/billable_metrics/{code}", summary: "Consulta a métrica usada por uma charge." },
  { domain: "Planos", method: "POST", path: "/plans", summary: "Cria plano com preço base e charges de uso." },
  { domain: "Planos", method: "POST", path: "/plans/{code}/charges", summary: "Adiciona uma usage-based charge ao plano." },
  { domain: "Planos", method: "GET", path: "/plans/{code}", summary: "Obtém a configuração do plano e suas charges." },
  { domain: "Assinaturas", method: "POST", path: "/subscriptions", summary: "Atribui um plano a um cliente externo." },
  { domain: "Assinaturas", method: "PUT", path: "/subscriptions/{external_id}", summary: "Atualiza a assinatura externa." },
  { domain: "Faturas", method: "GET", path: "/invoices", summary: "Lista faturas emitidas ou em preparação." },
  { domain: "Faturas", method: "PUT", path: "/invoices/{lago_id}/finalize", summary: "Finaliza uma fatura pendente." },
  { domain: "Pagamentos", method: "POST", path: "/payments", summary: "Registra um pagamento." },
  { domain: "Wallets", method: "POST", path: "/wallet_transactions", summary: "Cria transações de saldo em wallet." },
  { domain: "Crédito", method: "POST", path: "/credit_notes", summary: "Cria uma nota de crédito." },
  { domain: "Analytics", method: "GET", path: "/analytics/mrr", summary: "Consulta MRR por período." },
] as const;

const guideEntries = [
  { title: "Guias de billing", text: "Entenda eventos, métricas, planos e faturas de ponta a ponta.", icon: BookOpen, href: "#batch" },
  { title: "Referência da API", text: "Explore operações do contrato Lago API 1.51.0 por domínio.", icon: Braces, href: "#openapi" },
  { title: "Matriz 360º", text: "Acompanhe a cobertura, os dossiês e a próxima ação por domínio.", icon: FileStack, href: "/coverage" },
  { title: "Eventos em lote", text: "Envie, diagnostique e repita somente os itens que falharam.", icon: Activity, href: "#batch" },
  { title: "Modelos de cobrança", text: "Compare preços graduados e por volume com um simulador didático.", icon: CircleDollarSign, href: "#pricing" },
  { title: "Proveniência", text: "Consulte fontes, raws e referências preservadas para cada decisão.", icon: ShieldCheck, href: "#sources" },
] as const;

function LagoMark() {
  return <span className="lago-mark" aria-hidden="true"><i /><b /></span>;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function Home() {
  const [batchPanel, setBatchPanel] = useState<BatchPanel>("contract");
  const [units, setUnits] = useState(450);
  const [model, setModel] = useState<ChargeModel>("graduated");
  const [domain, setDomain] = useState<Domain>("Todos");
  const [query, setQuery] = useState("");
  const graduated = calculateGraduated(units);
  const volume = calculateVolume(units);
  const displayedValue = model === "graduated" ? graduated.total : volume.total;

  const visibleEndpoints = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return endpoints.filter((endpoint) => (domain === "Todos" || endpoint.domain === domain) && (!normalized || `${endpoint.method} ${endpoint.path} ${endpoint.summary}`.toLowerCase().includes(normalized)));
  }, [domain, query]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copyPayload = () => navigator.clipboard?.writeText(payload).then(() => toast.success("Payload copiado para a área de transferência."), () => toast.error("Não foi possível copiar o payload neste navegador."));

  const panelContent = {
    contract: { label: "Request", code: payload, title: "Envie um envelope de eventos completos.", text: "Cada item conserva a assinatura, a métrica e um identificador de transação para rastreamento e idempotência.", notes: [["Obrigatório", "transaction_id, external_subscription_id e code."], ["Condicional", "properties quando a métrica agrega um campo."]] },
    response: { label: "Resposta", code: response, title: "200 confirma recepção, não faturamento imediato.", text: "O processamento é assíncrono. A correlação de cliente pode ser concluída posteriormente no pipeline.", notes: [["T0", "Batch recebido pela API."], ["T1", "Uso processado para compor billing."]] },
    errors: { label: "Falhas", code: errorResponse, title: "Diagnostique falhas por transaction_id.", text: "Corrija e repita seletivamente apenas os itens que falharam; não duplique os eventos aceitos.", notes: [["invalid_code", "Métrica não aplicável ou inativa."], ["aggregation", "Propriedade exigida não enviada."]] },
  } as const;
  const selectedPanel = panelContent[batchPanel];

  return (
    <div className="lago-site">
      <header className="lago-header">
        <div className="lago-header-main">
          <Link href="/" className="lago-brand" aria-label="Lago 360º — início"><LagoMark /><strong>Lago</strong></Link>
          <button type="button" className="global-search global-search-trigger" onClick={openDocumentationSearch} aria-label="Abrir busca de documentação"><Search size={16} /><span>Buscar documentação…</span><kbd>Ctrl K</kbd></button>
          <div className="lago-header-actions"><span className="header-link">Lago 360º</span><a className="primary-cta" href="#batch">Começar <ArrowRight size={15} /></a></div>
        </div>
        <nav className="lago-doc-nav" aria-label="Navegação principal">
          <a className="is-active" href="#overview">Início</a><a href="#batch">Guia</a><a href="#openapi">Referência da API</a><Link href="/coverage">Cobertura 360º</Link><a href="#pricing">Modelos de preço</a><a href="#sources">Fontes</a>
        </nav>
      </header>

      <main>
        <section id="overview" className="official-hero scroll-target">
          <div className="hero-glow hero-glow-blue" /><div className="hero-glow hero-glow-pink" />
          <div className="official-hero-copy"><span className="hero-kicker">Lago 360º Billing Docs</span><h1>Documentação para o seu billing baseado em uso.</h1><p>Explore o fluxo completo de eventos, medição, precificação, assinaturas e faturas no Lago — em português e com evidência contratual preservada.</p><div className="hero-actions"><button className="primary-cta" onClick={() => scrollTo("batch")}>Explorar guias <ArrowRight size={16} /></button><Link href="/coverage" className="secondary-cta">Ver matriz 360º</Link></div></div>
        </section>

        <section className="entry-section" aria-labelledby="entry-heading"><h2 id="entry-heading">Comece com os guias e referências de billing</h2><div className="entry-grid">{guideEntries.map((entry, index) => { const Icon = entry.icon; const body = <><div className="entry-card-meta"><small>{String(index + 1).padStart(2, "0")}</small><em>360º</em></div><Icon size={25} strokeWidth={1.8} /><h3>{entry.title}</h3><p>{entry.text}</p><span>Explorar <ArrowRight size={15} /></span></>; const destination = entry.href.startsWith("/") ? <Link href={entry.href} className="entry-card">{body}</Link> : <a href={entry.href} className="entry-card">{body}</a>; return <motion.div key={entry.title} className="entry-card-motion" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.22, delay: index * 0.035, ease: [0.23, 1, 0.32, 1] }}>{destination}</motion.div>; })}</div></section>

        <div className="docs-shell">
          <section className="docs-intro"><span>DOCUMENTAÇÃO TÉCNICA</span><h2>Da atividade do produto à cobrança auditável.</h2><p>Os guias 360º preservam a sequência operacional sem abstrair contratos, limites, respostas ou referências da API.</p><div className="docs-stat-row"><div><strong>122</strong><span>paths no OpenAPI</span></div><div><strong>202</strong><span>operações catalogadas</span></div><div><strong>100</strong><span>eventos por lote</span></div></div></section>

          <section id="batch" className="docs-section scroll-target"><div className="docs-heading"><div><span className="section-kicker">Uso e ingestão</span><h2>Eventos em lote</h2></div><p>Envie até 100 eventos por requisição. Cada item é processado de forma identificável para permitir diagnóstico e retry seletivo.</p></div><div className="docs-tabs" role="tablist" aria-label="Detalhes de eventos em lote">{(["contract", "response", "errors"] as BatchPanel[]).map((panel) => <button key={panel} role="tab" aria-selected={batchPanel === panel} className={batchPanel === panel ? "is-active" : ""} onClick={() => setBatchPanel(panel)}>{panel === "contract" ? "Request" : panel === "response" ? "Resposta" : "Falhas"}</button>)}</div><div className="batch-grid-official"><div className="lago-code"><div><span>{selectedPanel.label}</span>{batchPanel === "contract" && <button onClick={copyPayload}><Copy size={14} />Copiar</button>}</div><pre><code>{selectedPanel.code}</code></pre><footer><b>POST</b><span>/events/batch</span></footer></div><div className="batch-summary"><h3>{selectedPanel.title}</h3><p>{selectedPanel.text}</p><dl>{selectedPanel.notes.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl><div className="inline-note"><Check size={16} />O limite documentado é de 100 eventos por requisição.</div></div></div></section>

          <section id="pricing" className="docs-section scroll-target pricing-official"><div className="docs-heading"><div><span className="section-kicker">Configuração comercial</span><h2>Modelos de cobrança</h2></div><p>Compare dois modos de cálculo usando as mesmas três faixas. Este simulador é didático e não representa uma fatura real.</p></div><div className="pricing-control-official"><div><label htmlFor="units">Uso agregado no período</label><strong>{units}<small> unidades</small></strong></div><input id="units" type="range" min="0" max="900" step="10" value={units} onChange={(event) => setUnits(Number(event.target.value))} /><div className="range-ticks"><span>0</span><span>100</span><span>500</span><span>900</span></div></div><div className="pricing-grid-official"><div className="pricing-choice" role="tablist" aria-label="Modelo de cobrança">{(["graduated", "volume"] as ChargeModel[]).map((item) => <button key={item} onClick={() => setModel(item)} className={model === item ? "is-active" : ""}><span>{item === "graduated" ? "Graduado" : "Por volume"}</span><small>{item === "graduated" ? "Preço por incremento de faixa" : "Uma tarifa para o total atingido"}</small></button>)}<div><span>Resultado didático</span><strong>{money(displayedValue)}</strong></div></div><div className="tiers-panel"><div className="tiers-header"><span>Faixas configuradas</span><span>{model === "graduated" ? "Graduado" : "Por volume"}</span></div>{[{ range: "0–100", rate: "US$ 0,10", width: "100%" }, { range: "101–500", rate: "US$ 0,08", width: "76%" }, { range: "501+", rate: "US$ 0,05", width: "48%" }].map((tier, index) => <div className={`tier-line ${model === "volume" && ((units <= 100 && index === 0) || (units > 100 && units <= 500 && index === 1) || (units > 500 && index === 2)) ? "is-selected" : ""}`} key={tier.range}><strong>{tier.range}</strong><i><b style={{ width: tier.width }} /></i><span>{tier.rate}/un.</span></div>)}<div className="pricing-formula"><span>Fórmula</span><strong>{model === "graduated" ? (units <= 100 ? `${units} × 0,10` : units <= 500 ? `100 × 0,10 + ${units - 100} × 0,08` : `100 × 0,10 + 400 × 0,08 + ${units - 500} × 0,05`) : `${units} × ${money(volume.rate)}`} = {money(displayedValue)}</strong></div></div></div></section>

          <section id="openapi" className="docs-section scroll-target"><div className="docs-heading"><div><span className="section-kicker">Lago API 1.51.0</span><h2>Referência da API</h2></div><p>Filtre por domínio e encontre a operação que conecta seu produto ao fluxo de billing do Lago.</p></div><div className="api-tools"><div className="api-filters">{domains.map((item) => <button key={item} onClick={() => setDomain(item)} className={domain === item ? "is-active" : ""}>{item}</button>)}</div><label className="api-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar endpoint ou operação" /><span>{visibleEndpoints.length}</span></label></div><div className="endpoint-list-official">{visibleEndpoints.map((endpoint) => <article key={`${endpoint.method}-${endpoint.path}`}><b className={`method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</b><code>{endpoint.path}</code><p>{endpoint.summary}</p><span>{endpoint.domain}</span></article>)}{!visibleEndpoints.length && <div className="empty-state">Nenhuma operação corresponde à busca.</div>}</div></section>

          <section id="sources" className="docs-section scroll-target sources-official"><div className="docs-heading"><div><span className="section-kicker">Fontes e rastreabilidade</span><h2>Proveniência preservada</h2></div><p>As fontes oficiais, o bundle OpenAPI e as capturas usadas nesta migração permanecem disponíveis para revisão técnica.</p></div><div className="source-grid-official"><a href="https://github.com/getlago/lago-openapi" target="_blank" rel="noreferrer"><FileCode2 size={22} /><span>Contrato</span><strong>OpenAPI e schemas oficiais</strong></a><a href="https://getlago.com/docs/guide/plans/charges/charge-models/graduated" target="_blank" rel="noreferrer"><Gauge size={22} /><span>Modelo</span><strong>Preço graduado</strong></a><a href="https://getlago.com/docs/guide/plans/charges/charge-models/volume" target="_blank" rel="noreferrer"><Layers3 size={22} /><span>Modelo</span><strong>Preço por volume</strong></a></div></section>
        </div>
      </main>
      <footer className="lago-footer"><div className="lago-brand"><LagoMark /><strong>Lago</strong></div><span>Documentação 360º baseada no OpenAPI 1.51.0</span><a href="https://getlago.com" target="_blank" rel="noreferrer">getlago.com</a></footer>
    </div>
  );
}

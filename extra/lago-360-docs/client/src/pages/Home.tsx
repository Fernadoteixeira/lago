/**
 * Design: Atlas de Operação — documentação editorial assimétrica, trilhas de telemetria,
 * papel mineral, azul-petróleo estrutural e lima de sinal. Sem Inter, cartões genéricos ou roxo.
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Database,
  FileCode2,
  Gauge,
  Layers3,
  Network,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateGraduated, calculateVolume } from "@/lib/pricing";
import { Link } from "wouter";

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

const domains = [
  "Todos",
  "Eventos",
  "Métricas",
  "Planos",
  "Assinaturas",
  "Faturas",
  "Pagamentos",
  "Wallets",
  "Crédito",
  "Analytics",
] as const;

type Domain = (typeof domains)[number];

const endpoints = [
  { domain: "Eventos", method: "POST", path: "/events", summary: "Registra um único evento de uso.", tag: "usage" },
  { domain: "Eventos", method: "POST", path: "/events/batch", summary: "Recebe até 100 eventos em uma única requisição.", tag: "usage" },
  { domain: "Eventos", method: "GET", path: "/events/{transaction_id}", summary: "Consulta um evento pela identidade de transação.", tag: "usage" },
  { domain: "Métricas", method: "POST", path: "/billable_metrics", summary: "Cria uma regra de agregação de uso.", tag: "metering" },
  { domain: "Métricas", method: "GET", path: "/billable_metrics/{code}", summary: "Consulta a métrica usada por uma charge.", tag: "metering" },
  { domain: "Planos", method: "POST", path: "/plans", summary: "Cria plano com preço base e charges de uso.", tag: "pricing" },
  { domain: "Planos", method: "POST", path: "/plans/{code}/charges", summary: "Adiciona uma usage-based charge ao plano.", tag: "pricing" },
  { domain: "Planos", method: "GET", path: "/plans/{code}", summary: "Obtém a configuração do plano e suas charges.", tag: "pricing" },
  { domain: "Assinaturas", method: "POST", path: "/subscriptions", summary: "Atribui um plano a um cliente externo.", tag: "billing" },
  { domain: "Assinaturas", method: "PUT", path: "/subscriptions/{external_id}", summary: "Atualiza a assinatura externa.", tag: "billing" },
  { domain: "Assinaturas", method: "GET", path: "/subscriptions/{external_id}/lifetime_usage", summary: "Consulta uso acumulado da assinatura.", tag: "billing" },
  { domain: "Faturas", method: "GET", path: "/invoices", summary: "Lista faturas emitidas ou em preparação.", tag: "invoicing" },
  { domain: "Faturas", method: "PUT", path: "/invoices/{lago_id}/finalize", summary: "Finaliza uma fatura pendente.", tag: "invoicing" },
  { domain: "Faturas", method: "POST", path: "/invoices/{lago_id}/payment_url", summary: "Gera uma URL de pagamento de fatura.", tag: "invoicing" },
  { domain: "Pagamentos", method: "POST", path: "/payments", summary: "Registra um pagamento.", tag: "collections" },
  { domain: "Pagamentos", method: "GET", path: "/payment_requests", summary: "Lista solicitações de pagamento.", tag: "collections" },
  { domain: "Wallets", method: "GET", path: "/customers/{external_customer_id}/wallets", summary: "Consulta créditos pré-pagos de um cliente.", tag: "credits" },
  { domain: "Wallets", method: "POST", path: "/wallet_transactions", summary: "Cria transações de saldo em wallet.", tag: "credits" },
  { domain: "Crédito", method: "POST", path: "/credit_notes", summary: "Cria uma nota de crédito.", tag: "credits" },
  { domain: "Crédito", method: "PUT", path: "/credit_notes/{lago_id}/void", summary: "Anula uma nota de crédito.", tag: "credits" },
  { domain: "Analytics", method: "GET", path: "/analytics/mrr", summary: "Consulta MRR por período.", tag: "analytics" },
  { domain: "Analytics", method: "GET", path: "/analytics/usage", summary: "Consulta dados agregados de uso.", tag: "analytics" },
  { domain: "Analytics", method: "GET", path: "/analytics/invoice_collection", summary: "Consulta dados de coleção de faturas.", tag: "analytics" },
] as const;

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function MetricRail() {
  return (
    <div className="metric-rail" aria-label="Cadeia de cobrança">
      {[
        ["01", "Evento", "transaction_id"],
        ["02", "Métrica", "agregação"],
        ["03", "Cobrança", "precificação"],
        ["04", "Valor", "fee"],
        ["05", "Fatura", "documento"],
      ].map(([index, title, caption], indexPosition) => (
        <div className="rail-stage" key={title}>
          <div className={`rail-node ${indexPosition === 1 || indexPosition === 3 ? "rail-node--signal" : ""}`}>{index}</div>
          <div><strong>{title}</strong><span>{caption}</span></div>
          {indexPosition < 4 && <div className="rail-link" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

function RouteMarker({ step, label, note }: { step: string; label: string; note: string }) {
  return <div className="route-marker" aria-label={`Etapa ${step}: ${label}`}><span>{step}</span><i aria-hidden="true" /><strong>{label}</strong><em>{note}</em></div>;
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
    return endpoints.filter((endpoint) => {
      const inDomain = domain === "Todos" || endpoint.domain === domain;
      const inQuery = !normalized || `${endpoint.method} ${endpoint.path} ${endpoint.summary}`.toLowerCase().includes(normalized);
      return inDomain && inQuery;
    });
  }, [domain, query]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copyPayload = () => {
    navigator.clipboard?.writeText(payload).then(
      () => toast.success("Payload copiado para a área de transferência."),
      () => toast.error("Não foi possível copiar o payload neste navegador."),
    );
  };

  const panelContent = {
    contract: {
      eyebrow: "Contrato do request",
      code: payload,
      title: "O lote é um envelope de eventos completos.",
      text: "Cada item conserva a sua assinatura, a métrica que será medida e um identificador de transação que permite rastreamento e idempotência.",
      notes: [
        ["Obrigatório", "transaction_id, external_subscription_id e code."],
        ["Condicional", "properties é exigida quando a métrica agrega um campo."],
      ],
    },
    response: {
      eyebrow: "Confirmação de ingestão",
      code: response,
      title: "200 confirma recepção; não confirma faturamento imediato.",
      text: "O processamento é assíncrono. Na resposta inicial, lago_customer_id pode ser null, porque a correlação do cliente acontece no pipeline posterior.",
      notes: [
        ["T0", "Batch recebido pela API."],
        ["T1", "Uso processado e disponível para compor billing."],
      ],
    },
    errors: {
      eyebrow: "Diagnóstico por item",
      code: errorResponse,
      title: "Falhas permanecem endereçáveis por transaction_id.",
      text: "Erros de código, propriedade de agregação e filtros devem ser corrigidos seletivamente; não é necessário duplicar os itens aceitos no retry.",
      notes: [
        ["invalid_code", "Métrica não aplicável ou inativa."],
        ["missing_aggregation_property", "Campo necessário para a agregação não foi enviado."],
      ],
    },
  } as const;

  const selectedPanel = panelContent[batchPanel];

  return (
    <div className="atlas-app">
      <aside className="atlas-sidebar" aria-label="Navegação da documentação">
        <div className="brand-lockup" role="banner">
          <div className="brand-mark"><span /><i /></div>
          <div><span className="brand-name">Lago</span><span className="brand-sub">Atlas de cobrança 360º</span></div>
        </div>

        <nav className="sidebar-nav" aria-label="Seções">
          {[
            ["overview", "Visão geral", Network],
            ["batch", "Eventos em lote", Activity],
            ["pricing", "Modelos de cobrança", CircleDollarSign],
            ["openapi", "Explorador OpenAPI", FileCode2],
            ["sources", "Proveniência", ShieldCheck],
          ].map(([id, label, Icon]) => (
            <button className="nav-link" onClick={() => scrollTo(id as string)} key={id as string}>
              <Icon size={16} strokeWidth={1.8} /><span>{label as string}</span><ChevronRight size={14} />
            </button>
          ))}
          <Link href="/coverage" className="nav-link"><FileCode2 size={16} strokeWidth={1.8} /><span>Matriz 360º</span><ArrowUpRight size={14} /></Link>
        </nav>

        <div className="sidebar-dossier">
          <span>DOSSIER ATIVO</span>
          <strong>Lago API 1.51.0</strong>
          <p>Eventos em lote · cobrança por uso · OpenAPI.</p>
          <button onClick={() => scrollTo("openapi")}><Search size={14} />Explorar operações</button>
        </div>
      </aside>

      <main className="atlas-main">
        <header className="topline">
          <div><span className="live-dot" />Documentação operacional</div>
          <div className="topline-meta">OPENAPI · EVENTOS EM LOTE · COBRANÇA POR USO</div>
        </header>

        <section id="overview" className="hero-section scroll-target">
          <div className="hero-copy">
            <p className="eyebrow">Atlas de operação / Cobrança Lago</p>
            <h1>Do uso bruto<br /><em>à evidência</em><br />de cobrança.</h1>
            <p className="hero-summary">Uma leitura 360º do caminho que liga eventos de produto, regras de medição, modelos de preço e faturas no Lago.</p>
            <div className="hero-actions">
              <Button className="atlas-button" onClick={() => scrollTo("batch")}>Mapear eventos em lote <ArrowDownRight size={17} /></Button>
              <button className="text-action" onClick={() => scrollTo("pricing")}>Comparar modelos <ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-top"><span>FLUXO DE REFERÊNCIA</span><span>05 ETAPAS</span></div>
            <MetricRail />
            <div className="hero-panel-note"><Sparkles size={15} />Toda decisão financeira pode ser lida como uma cadeia de evidências.</div>
          </div>
        </section>

        <section className="signal-strip" aria-label="Resumo da API">
          <div><em>CATÁLOGO</em><strong>122</strong><span>caminhos no pacote OpenAPI</span></div>
          <div><em>MAPA</em><strong>202</strong><span>operações catalogadas</span></div>
          <div><em>LIMITE VÁLIDO</em><strong>100</strong><span>eventos por lote</span></div>
          <div><em>DECISÃO</em><strong>2</strong><span>modelos comparados aqui</span></div>
        </section>

        <section id="batch" className="content-section batch-section scroll-target">
          <RouteMarker step="01" label="EVENTO" note="a ingestão inaugura a trilha de cobrança" />
          <div className="section-heading">
            <div><p className="eyebrow">01 / Ingestão</p><h2>Eventos em lote sem zonas cegas.</h2></div>
            <p>O envio em lote reduz a sobrecarga de transporte; a interpretação de cada item continua dependente da assinatura, métrica, propriedades e regras aplicáveis.</p>
          </div>

          <div className="batch-tabs" role="tablist" aria-label="Detalhes dos eventos em lote">
            {(["contract", "response", "errors"] as BatchPanel[]).map((panel) => (
              <button key={panel} role="tab" aria-selected={batchPanel === panel} className={batchPanel === panel ? "is-active" : ""} onClick={() => setBatchPanel(panel)}>
                {panel === "contract" ? "Contrato" : panel === "response" ? "Resposta" : "Falhas"}
              </button>
            ))}
          </div>

          <div className="batch-grid">
            <div className="code-block-wrap">
              <div className="code-header"><span>{selectedPanel.eyebrow}</span>{batchPanel === "contract" && <button onClick={copyPayload} aria-label="Copiar exemplo de payload"><Copy size={15} />copiar</button>}</div>
              <pre><code>{selectedPanel.code}</code></pre>
              <div className="code-footer"><span className="http-method">POST</span><span>/events/batch</span></div>
            </div>
            <div className="batch-explainer">
              <h3>{selectedPanel.title}</h3>
              <p>{selectedPanel.text}</p>
              <div className="fact-grid">
                {selectedPanel.notes.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
              </div>
              <div className="batch-rule"><Database size={17} /><span><b>Limite documentado:</b> uma requisição aceita até 100 eventos. A lista não cria agregação implícita.</span></div>
            </div>
          </div>
        </section>

        <section id="pricing" className="content-section pricing-section scroll-target">
          <RouteMarker step="03" label="COBRANÇA" note="a regra de preço interpreta a quantidade medida" />
          <div className="section-heading pricing-heading">
            <div><p className="eyebrow">02 / Precificação</p><h2>O mesmo uso conta histórias de receita diferentes.</h2></div>
            <p>Simulador didático baseado em três faixas: 0–100 a US$ 0,10, 101–500 a US$ 0,08, e 501+ a US$ 0,05 por unidade.</p>
          </div>

          <div className="pricing-control">
            <div><label htmlFor="units">Uso agregado no período</label><div className="units-readout"><strong>{units}</strong><span>unidades</span></div></div>
            <input id="units" type="range" min="0" max="900" step="10" value={units} onChange={(event) => setUnits(Number(event.target.value))} />
            <div className="range-ticks"><span>0</span><span>100</span><span>500</span><span>900</span></div>
          </div>

          <div className="pricing-layout">
            <div className="model-toggle" role="tablist" aria-label="Modelo de cobrança">
              {(["graduated", "volume"] as ChargeModel[]).map((item) => (
                <button key={item} className={model === item ? "is-active" : ""} onClick={() => setModel(item)}>
                  <span>{item === "graduated" ? "Graduado" : "Por volume"}</span>
                  <small>{item === "graduated" ? "incrementos por faixa" : "uma tarifa para todo o volume"}</small>
                </button>
              ))}
              <div className="pricing-answer"><span>Resultado didático</span><strong>{money(displayedValue)}</strong><p>{model === "graduated" ? "Soma de cada trecho de uso por faixa." : `Toda a quantidade a ${money(volume.rate)} por unidade.`}</p></div>
            </div>

            <div className="pricing-ruler">
              <div className="ruler-head"><span>FAIXAS CONFIGURADAS</span><span>MODELO ATIVO: {model === "graduated" ? "GRADUADO" : "POR VOLUME"}</span></div>
              {[{ range: "0–100", rate: "US$ 0,10", width: "100%" }, { range: "101–500", rate: "US$ 0,08", width: "77%" }, { range: "501+", rate: "US$ 0,05", width: "48%" }].map((tier, index) => (
                <div className={`tier-row ${model === "volume" && ((units <= 100 && index === 0) || (units > 100 && units <= 500 && index === 1) || (units > 500 && index === 2)) ? "is-selected" : ""}`} key={tier.range}>
                  <strong>{tier.range}</strong><div className="tier-bar"><i style={{ width: tier.width }} /></div><span>{tier.rate}/un.</span>
                </div>
              ))}
              <div className="calculation">
                {model === "graduated" ? <><span>Fórmula</span><strong>{units <= 100 ? `${units} × 0,10` : units <= 500 ? `100 × 0,10 + ${units - 100} × 0,08` : `100 × 0,10 + 400 × 0,08 + ${units - 500} × 0,05`} = {money(graduated.total)}</strong></> : <><span>Fórmula</span><strong>{units} × {money(volume.rate)} = {money(volume.total)}</strong></>}
              </div>
            </div>
          </div>
        </section>

        <section id="openapi" className="content-section explorer-section scroll-target">
          <RouteMarker step="04" label="VALOR" note="o contrato conecta configuração, fee e consulta" />
          <div className="section-heading">
            <div><p className="eyebrow">03 / OpenAPI</p><h2>Explore o contrato por domínio.</h2></div>
            <p>Filtre os domínios centrais, pesquise por caminho e encontre rapidamente a operação que conecta o seu fluxo de produto ao Lago.</p>
          </div>
          <div className="explorer-tools">
            <div className="domain-filters" aria-label="Filtros de domínio">
              {domains.map((item) => <button key={item} className={domain === item ? "is-active" : ""} onClick={() => setDomain(item)}>{item}</button>)}
            </div>
            <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar caminho ou operação" aria-label="Buscar operação da API" /><span>{visibleEndpoints.length}</span></label>
          </div>
          <div className="endpoint-list" aria-live="polite">
            {visibleEndpoints.map((endpoint) => <article className="endpoint-row" key={`${endpoint.method}-${endpoint.path}`}><span className={`method method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span><code>{endpoint.path}</code><p>{endpoint.summary}</p><span className="endpoint-domain">{endpoint.domain}</span></article>)}
            {!visibleEndpoints.length && <div className="empty-state">Nenhuma operação corresponde ao filtro. Tente buscar por “fatura”, “assinatura” ou “evento”.</div>}
          </div>
        </section>

        <section id="sources" className="content-section provenance-section scroll-target">
          <RouteMarker step="05" label="FATURA" note="a evidência final preserva origem, regra e documento" />
          <div className="section-heading"><div><p className="eyebrow">04 / Proveniência</p><h2>Fontes preservadas para investigação contínua.</h2></div><p>Os arquivos brutos OpenAPI, páginas de precificação e capturas renderizadas foram mantidos com inventário e SHA-256 para apoiar análise técnica e criação de referências.</p></div>
          <div className="provenance-grid">
            <a className="source-doc" href="https://github.com/getlago/lago-openapi" target="_blank" rel="noreferrer"><FileCode2 size={26} /><span>OpenAPI</span><strong>Bundle e schemas oficiais</strong><em>getlago/lago-openapi <ArrowUpRight size={14} /></em></a>
            <a className="source-doc" href="https://getlago.com/docs/guide/plans/charges/charge-models/graduated" target="_blank" rel="noreferrer"><Gauge size={26} /><span>Precificação</span><strong>Modelo graduado</strong><em>Documentação oficial <ArrowUpRight size={14} /></em></a>
            <a className="source-doc" href="https://getlago.com/docs/guide/plans/charges/charge-models/volume" target="_blank" rel="noreferrer"><Layers3 size={26} /><span>Precificação</span><strong>Modelo por volume</strong><em>Documentação oficial <ArrowUpRight size={14} /></em></a>
          </div>
          <div className="visual-references">
            <figure><img src="/manus-storage/lago-landing-reference_686d2548.png" alt="Captura preservada da navegação de documentação do Lago em tema escuro" /><figcaption>Referência visual: navegação e busca da documentação.</figcaption></figure>
            <figure><img src="/manus-storage/lago-docs-reference_3d11d3f7.png" alt="Captura preservada da landing institucional do Lago com mockup de fatura" /><figcaption>Referência visual: produto, uso, créditos e fatura.</figcaption></figure>
          </div>
        </section>

        <footer className="atlas-footer"><span>ATLAS DE OPERAÇÃO · COBRANÇA LAGO</span><span>Baseado no OpenAPI 1.51.0 · simulações explicitamente didáticas</span></footer>
      </main>
    </div>
  );
}

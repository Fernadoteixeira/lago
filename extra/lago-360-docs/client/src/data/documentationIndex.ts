import { coverageDomains, type CoverageStatus } from "./coverage";

export type DocumentationEntryKind = "Guia" | "Rota" | "Operação";

export type DocumentationEntry = {
  id: string;
  kind: DocumentationEntryKind;
  title: string;
  detail: string;
  href: string;
  domain: string;
  flowStage: string;
  status?: CoverageStatus;
  method?: "GET" | "POST" | "PUT";
};

const apiOperations: Array<Pick<DocumentationEntry, "title" | "detail" | "href" | "domain" | "method">> = [
  { method: "POST", title: "/events", detail: "Registra um único evento de uso.", href: "/#openapi", domain: "Eventos" },
  { method: "POST", title: "/events/batch", detail: "Recebe até 100 eventos em uma única requisição.", href: "/#batch", domain: "Eventos" },
  { method: "GET", title: "/events/{transaction_id}", detail: "Consulta um evento pela identidade de transação.", href: "/#openapi", domain: "Eventos" },
  { method: "POST", title: "/billable_metrics", detail: "Cria uma regra de agregação de uso.", href: "/docs/metricas", domain: "Métricas" },
  { method: "GET", title: "/billable_metrics/{code}", detail: "Consulta a métrica usada por uma charge.", href: "/docs/metricas", domain: "Métricas" },
  { method: "POST", title: "/plans", detail: "Cria plano com preço base e charges de uso.", href: "/docs/planos", domain: "Planos" },
  { method: "POST", title: "/plans/{code}/charges", detail: "Adiciona uma charge baseada em uso ao plano.", href: "/docs/planos", domain: "Planos" },
  { method: "GET", title: "/plans/{code}", detail: "Obtém o plano e suas charges configuradas.", href: "/docs/planos", domain: "Planos" },
  { method: "POST", title: "/subscriptions", detail: "Atribui um plano a um cliente externo.", href: "/docs/assinaturas", domain: "Assinaturas" },
  { method: "PUT", title: "/subscriptions/{external_id}", detail: "Atualiza a assinatura externa.", href: "/docs/assinaturas", domain: "Assinaturas" },
  { method: "GET", title: "/invoices", detail: "Lista faturas emitidas ou em preparação.", href: "/docs/faturas", domain: "Faturas" },
  { method: "POST", title: "/payments", detail: "Registra um pagamento.", href: "/docs/pagamentos", domain: "Pagamentos" },
];

const staticRoutes: DocumentationEntry[] = [
  { id: "route-home", kind: "Rota", title: "/", detail: "Visão geral da documentação Lago 360º.", href: "/", domain: "Fundamentos", flowStage: "Fundamento" },
  { id: "route-batch", kind: "Rota", title: "/#batch", detail: "Guia de eventos em lote, falhas e retry seletivo.", href: "/#batch", domain: "Eventos", flowStage: "Evento" },
  { id: "route-pricing", kind: "Rota", title: "/#pricing", detail: "Comparação de cobrança graduada e por volume.", href: "/#pricing", domain: "Planos", flowStage: "Cobrança" },
  { id: "route-coverage", kind: "Rota", title: "/coverage", detail: "Matriz rastreável de cobertura 360º.", href: "/coverage", domain: "Fundamentos", flowStage: "Fundamento" },
];

export const documentationIndex: DocumentationEntry[] = [
  ...coverageDomains.map((domain) => ({
    id: `guide-${domain.slug}`,
    kind: "Guia" as const,
    title: domain.title,
    detail: domain.contractFocus,
    href: `/docs/${domain.slug}`,
    domain: domain.shortTitle,
    flowStage: domain.flowStage,
    status: domain.status,
  })),
  ...staticRoutes,
  ...apiOperations.map((operation) => ({
    id: `operation-${operation.method}-${operation.title}`,
    kind: "Operação" as const,
    title: operation.title,
    detail: operation.detail,
    href: operation.href,
    domain: operation.domain,
    flowStage: operation.domain === "Eventos" ? "Evento" : operation.domain === "Métricas" ? "Métrica" : operation.domain === "Planos" || operation.domain === "Assinaturas" ? "Cobrança" : "Fatura",
    method: operation.method,
  })),
];

export const documentationFilterOptions = {
  domains: ["Todos", ...Array.from(new Set(documentationIndex.map((entry) => entry.domain)))],
  stages: ["Todos", ...Array.from(new Set(documentationIndex.map((entry) => entry.flowStage)))],
  statuses: ["Todos", "Em implementação", "Mapeado", "Planejado"],
  methods: ["Todos", "GET", "POST", "PUT"],
} as const;

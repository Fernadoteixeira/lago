/**
 * Design: Atlas de Operação — dados de cobertura transformam o contrato em um mapa
 * rastreável. Estados informam prontidão sem alegar documentação que ainda não existe.
 */
export type CoverageStatus = "Em implementação" | "Mapeado" | "Planejado";

export type CoverageDomain = {
  slug: string;
  order: string;
  title: string;
  shortTitle: string;
  status: CoverageStatus;
  contractFocus: string;
  scope: string;
  nextTask: string;
  openApiAnchor: string;
  existingGuide?: string;
  flowStage: "Fundamento" | "Evento" | "Métrica" | "Cobrança" | "Valor" | "Fatura";
};

export const coverageDomains: CoverageDomain[] = [
  {
    slug: "fundamentos",
    order: "00",
    title: "Fundamentos de API",
    shortTitle: "Fundamentos",
    status: "Mapeado",
    contractFocus: "Autenticação, regiões, versionamento, paginação, idempotência e erros.",
    scope: "Define as convenções que tornam todas as chamadas reproduzíveis e auditáveis.",
    nextTask: "Publicar o guia transversal com headers, códigos de resposta e limites.",
    openApiAnchor: "openapi",
    flowStage: "Fundamento",
  },
  {
    slug: "eventos",
    order: "01",
    title: "Eventos de uso",
    shortTitle: "Eventos",
    status: "Em implementação",
    contractFocus: "POST /events, POST /events/batch e consulta por transaction_id.",
    scope: "Ingestão, idempotência, erros por item, replay e correlação do uso bruto.",
    nextTask: "Adicionar exemplos executáveis em Python e Node.js para lote parcial e retry seletivo.",
    openApiAnchor: "batch",
    existingGuide: "/#batch",
    flowStage: "Evento",
  },
  {
    slug: "metricas",
    order: "02",
    title: "Métricas faturáveis",
    shortTitle: "Métricas",
    status: "Em implementação",
    contractFocus: "Billable metrics, agregação, propriedades e filtros de medição.",
    scope: "Converte evento em quantidade mensurável para uma regra comercial.",
    nextTask: "Cobrir filtros e agregações avançadas, com cenários de alteração de definição e reconciliação de uso.",
    openApiAnchor: "openapi",
    flowStage: "Métrica",
  },
  {
    slug: "planos",
    order: "03",
    title: "Planos e charges",
    shortTitle: "Planos",
    status: "Em implementação",
    contractFocus: "Planos, charges de uso, faixas e regras de precificação.",
    scope: "Materializa a política comercial que interpreta uma métrica faturável.",
    nextTask: "Cobrir todos os modelos do contrato, seus limites e cenários de alteração.",
    openApiAnchor: "pricing",
    existingGuide: "/#pricing",
    flowStage: "Cobrança",
  },
  {
    slug: "assinaturas",
    order: "04",
    title: "Assinaturas",
    shortTitle: "Assinaturas",
    status: "Em implementação",
    contractFocus: "Criação, atualização, encerramento e consulta de uso acumulado.",
    scope: "Associa o plano ao cliente e delimita o ciclo de vida comercial do uso.",
    nextTask: "Cobrir onboarding, alteração de plano, cancelamento e impacto temporal na cobrança.",
    openApiAnchor: "openapi",
    flowStage: "Cobrança",
  },
  {
    slug: "faturas",
    order: "05",
    title: "Faturas",
    shortTitle: "Faturas",
    status: "Mapeado",
    contractFocus: "Consulta, preparação, finalização e linhas de fatura.",
    scope: "Transforma valor calculado em documento financeiro e evidência de cobrança.",
    nextTask: "Documentar estados, linhas, impostos, finalização e reemissão de faturas.",
    openApiAnchor: "openapi",
    flowStage: "Fatura",
  },
  {
    slug: "pagamentos",
    order: "06",
    title: "Pagamentos",
    shortTitle: "Pagamentos",
    status: "Planejado",
    contractFocus: "Pagamentos, solicitações de pagamento e URLs de cobrança.",
    scope: "Permite liquidar a fatura e acompanhar estados de recebimento.",
    nextTask: "Cobrir solicitação, confirmação, falha e reconciliação de pagamento.",
    openApiAnchor: "openapi",
    flowStage: "Fatura",
  },
  {
    slug: "creditos",
    order: "07",
    title: "Créditos e wallets",
    shortTitle: "Créditos",
    status: "Planejado",
    contractFocus: "Wallets, transações de saldo, crédito pré-pago e notas de crédito.",
    scope: "Ajusta valor devido e preserva a trilha de saldo e compensação financeira.",
    nextTask: "Documentar consumo, expiração, ajuste, anulação e ligação com faturas.",
    openApiAnchor: "openapi",
    flowStage: "Valor",
  },
  {
    slug: "webhooks",
    order: "08",
    title: "Webhooks e operação",
    shortTitle: "Webhooks",
    status: "Planejado",
    contractFocus: "Entrega assíncrona, verificação, idempotência e diagnóstico de eventos.",
    scope: "Conecta o estado de billing a sistemas externos com segurança e observabilidade.",
    nextTask: "Inventariar eventos e fornecer consumidores seguros em Python e Node.js.",
    openApiAnchor: "openapi",
    flowStage: "Fatura",
  },
  {
    slug: "analytics",
    order: "09",
    title: "Analytics e auditoria",
    shortTitle: "Analytics",
    status: "Mapeado",
    contractFocus: "MRR, uso, coleções e referências de auditoria disponíveis pela API.",
    scope: "Fecha o ciclo com indicadores, reconciliação e evidência operacional.",
    nextTask: "Adicionar exemplos de consulta, paginação, filtros e reconciliação por período.",
    openApiAnchor: "openapi",
    flowStage: "Fatura",
  },
];

export const coverageCounts = coverageDomains.reduce(
  (counts, domain) => ({ ...counts, [domain.status]: counts[domain.status] + 1 }),
  { "Em implementação": 0, Mapeado: 0, Planejado: 0 } as Record<CoverageStatus, number>,
);

export function getCoverageDomain(slug: string | undefined) {
  return coverageDomains.find((domain) => domain.slug === slug);
}

/**
 * Design: Atlas de Operação — o dossiê comercial conecta um estado da interface
 * ao contrato OpenAPI preservado, sem transformar o guia em uma cópia da especificação.
 */

export type CommercialDossier = {
  lead: string;
  operations: Array<{ method: string; path: string; input: string; purpose: string }>;
  prerequisites: string[];
  transitions: string[];
  exception: string;
  snippet: string;
  source: string;
};

export const commercialDossiers: Record<string, CommercialDossier> = {
  metricas: {
    lead: "A métrica transforma um evento bruto em unidade faturável. O código permanece estável entre a emissão do evento e a regra comercial que o interpreta.",
    operations: [
      { method: "POST", path: "/billable_metrics", input: "BillableMetricCreateInput", purpose: "Cria o componente de pricing que receberá eventos." },
      { method: "GET", path: "/billable_metrics", input: "page · per_page", purpose: "Lista as métricas para reconciliação e seleção de charges." },
      { method: "POST", path: "/billable_metrics/evaluate_expression", input: "BillableMetricEvaluateExpressionInput", purpose: "Testa uma expressão com um evento sem criar uma métrica." },
      { method: "PUT", path: "/billable_metrics/{code}", input: "BillableMetricUpdateInput", purpose: "Atualiza a definição endereçada pelo código da métrica." },
    ],
    prerequisites: [
      "Definir um code único e estável que também será usado pelo evento de uso.",
      "Escolher aggregation_type; count_agg dispensa field_name, enquanto as agregações baseadas em valor dependem de uma propriedade observável.",
      "Validar expression, arredondamento e filtros com dados representativos antes de conectar a métrica a uma charge.",
    ],
    transitions: ["Evento recebido", "Propriedade agregada", "Unidade faturável", "Charge do plano"],
    exception: "Se a propriedade esperada não existir ou a expressão não puder ser avaliada, trate o evento como diagnóstico de ingestão; não altere retroativamente a definição sem avaliar o impacto em uso já medido.",
    snippet: `POST /billable_metrics\n\n{\n  "billable_metric": {\n    "name": "Chamadas de API",\n    "code": "api_calls",\n    "aggregation_type": "count_agg"\n  }\n}`,
    source: "OpenAPI 1.51.0 · /billable_metrics · linhas 976–1068 e 11808–11900",
  },
  planos: {
    lead: "O plano concentra a cadência recorrente e as regras de cobrança por uso. A charge conecta uma métrica já criada ao modelo de preço que será aplicado à assinatura.",
    operations: [
      { method: "POST", path: "/plans", input: "PlanCreateInput", purpose: "Cria o plano, sua cobrança base e suas charges de uso." },
      { method: "GET", path: "/plans", input: "page · per_page", purpose: "Lista planos disponíveis para composição e auditoria." },
      { method: "GET · PUT", path: "/plans/{code}", input: "PlanUpdateInput no PUT", purpose: "Consulta ou atualiza a política comercial identificada pelo código." },
      { method: "POST", path: "/plans/{code}/charges", input: "schema do contrato", purpose: "Adiciona uma charge a um plano já existente." },
    ],
    prerequisites: [
      "Criar e recuperar o billable_metric_id da métrica antes de referenciá-lo em uma charge.",
      "Definir interval, amount_cents, amount_currency e pay_in_advance para a camada recorrente do plano.",
      "Escolher charge_model e propriedades coerentes com o modelo; revisar a compatibilidade entre pay_in_advance, invoiceable e regroup_paid_fees.",
    ],
    transitions: ["Métrica faturável", "Charge de uso", "Plano ativo", "Assinatura vinculada"],
    exception: "A exclusão de um plano pode afetar assinaturas ativas. Prefira avaliar atualização, vigência e migração antes de remover uma política comercial em uso.",
    snippet: `POST /plans\n\n{\n  "plan": {\n    "name": "Pro",\n    "code": "pro_monthly",\n    "interval": "monthly",\n    "amount_cents": 0,\n    "amount_currency": "USD",\n    "pay_in_advance": false,\n    "charges": [{\n      "billable_metric_id": "<metric-uuid>",\n      "charge_model": "graduated"\n    }]\n  }\n}`,
    source: "OpenAPI 1.51.0 · /plans e /plans/{code}/charges · linhas 4414–4519 e 19912–20031",
  },
  assinaturas: {
    lead: "A assinatura vincula uma política de preço a um cliente externo e estabelece a identidade idempotente do ciclo comercial. É o ponto onde o uso passa a ter contexto financeiro.",
    operations: [
      { method: "POST", path: "/subscriptions", input: "SubscriptionCreateInput", purpose: "Vincula customer, plan_code e external_id em uma assinatura." },
      { method: "GET · PUT · DELETE", path: "/subscriptions/{external_id}", input: "external_id", purpose: "Consulta, altera ou encerra a assinatura identificada externamente." },
      { method: "GET", path: "/subscriptions/{external_id}/lifetime_usage", input: "external_id", purpose: "Consulta o uso acumulado associado à assinatura." },
      { method: "GET · POST", path: "/subscriptions/{external_id}/charges", input: "external_id", purpose: "Consulta ou ajusta charges no escopo da assinatura." },
    ],
    prerequisites: [
      "Garantir que external_customer_id corresponda a um cliente previamente criado ou sincronizado.",
      "Usar plan_code de um plano ativo e external_id único; o contrato descreve esse identificador como chave de idempotência.",
      "Escolher billing_time entre calendar e anniversary; datas de início e término devem estar em UTC ISO 8601.",
    ],
    transitions: ["Cliente externo", "Plano ativo", "Assinatura idempotente", "Evento de uso"],
    exception: "Uma regra de ativação baseada em pagamento pode deixar a assinatura incompleta até a confirmação. Não trate a criação HTTP isoladamente como prova de ativação comercial.",
    snippet: `POST /subscriptions\n\n{\n  "subscription": {\n    "external_customer_id": "acme-001",\n    "plan_code": "pro_monthly",\n    "external_id": "sub-acme-pro-001",\n    "billing_time": "calendar"\n  }\n}`,
    source: "OpenAPI 1.51.0 · /subscriptions · linhas 5203–6033 e 21188–21303",
  },
};

/*
 * UI oficial Lago — dossiês financeiros conectam o fluxo de cobrança aos
 * contratos preservados, sem induzir execução de operações financeiras reais.
 */

export type FinancialDossier = {
  lead: string;
  operations: Array<{ method: string; path: string; input: string; purpose: string }>;
  prerequisites: string[];
  transitions: string[];
  exception: string;
  snippet: string;
  source: string;
};

export const financialDossiers: Record<string, FinancialDossier> = {
  faturas: {
    lead: "A fatura é a evidência financeira que consolida a cobrança do ciclo. A operação deve preservar a identidade Lago da fatura, o estado de emissão e o estado de pagamento como sinais distintos de reconciliação.",
    operations: [
      { method: "GET", path: "/invoices", input: "page · per_page · status · payment_status", purpose: "Lista faturas por estado de emissão e liquidação para fechar um período." },
      { method: "POST", path: "/invoices", input: "InvoiceOneOffCreateInput", purpose: "Cria uma fatura one-off para cliente e fees explícitas." },
      { method: "POST", path: "/invoices/{lago_id}/finalize", input: "lago_id", purpose: "Finaliza uma fatura antes da cobrança ou entrega do documento." },
      { method: "POST", path: "/invoices/{lago_id}/retry_payment", input: "PaymentMethodReference opcional", purpose: "Reenvia a fatura para coleta e repete a tentativa de pagamento." },
    ],
    prerequisites: [
      "Correlacionar lago_id da fatura, external_customer_id e período financeiro antes de iniciar qualquer ajuste.",
      "Tratar status da fatura e payment_status como dimensões independentes da reconciliação.",
      "Usar valores monetários em cents e preservar a moeda do documento em toda a cadeia de prova.",
    ],
    transitions: ["Uso e fees calculadas", "Fatura draft/finalized", "Coleta ou pagamento manual", "Recebimento reconciliado"],
    exception: "Uma fatura finalized não deve ser removida. Sem payload, o void é permitido apenas quando o pagamento ainda não foi sucedido; cenários de compensação usam nota de crédito conforme o contrato.",
    snippet: `GET /invoices?external_customer_id=acme-001&payment_status=pending\nAuthorization: Bearer $LAGO_API_KEY\n\n# Reconcilie por lago_id, moeda, total e payment_status.\n# Não conclua liquidação apenas pelo status de emissão.`,
    source: "OpenAPI 1.51.0 · /invoices e subrotas · linhas 3708–4164; FINANCIAL_CONTRACT_1_51.md",
  },
  pagamentos: {
    lead: "O fechamento de pagamento associa uma fatura à coleta, ao comprovante e ao estado de liquidação. O contrato também expõe solicitações de cobrança para faturas vencidas e pagamentos manuais auditáveis.",
    operations: [
      { method: "POST", path: "/payment_requests", input: "PaymentRequestCreateInput", purpose: "Cria solicitação para coletar faturas vencidas de um cliente." },
      { method: "POST", path: "/payments", input: "PaymentCreateInput", purpose: "Registra um pagamento manual dentro da trilha financeira." },
      { method: "GET", path: "/payments", input: "external_customer_id · invoice_id", purpose: "Lista pagamentos filtráveis para reconciliar uma fatura." },
      { method: "GET", path: "/payment_receipts", input: "invoice_id", purpose: "Recupera comprovantes que sustentam a evidência de recebimento." },
    ],
    prerequisites: [
      "Fixar o lago_id da fatura e o external_customer_id como chaves de correlação em todos os registros locais.",
      "Comparar valor, moeda e status de pagamento antes de marcar uma fatura como liquidada em sistemas externos.",
      "Preservar comprovantes como evidência e não inferir sucesso somente pela criação de uma solicitação de pagamento.",
    ],
    transitions: ["Fatura pendente", "Solicitação ou pagamento", "Comprovante", "payment_status reconciliado"],
    exception: "Falhas de coleta e tentativas repetidas devem permanecer rastreáveis. Reenvie ou reexecute somente após confirmar o estado atual da fatura e do pagamento relacionado.",
    snippet: `GET /payments?invoice_id=<lago-invoice-id>\nAuthorization: Bearer $LAGO_API_KEY\n\nGET /payment_receipts?invoice_id=<lago-invoice-id>\n\n# Compare a evidência de pagamento com payment_status da fatura.`,
    source: "OpenAPI 1.51.0 · /payments, /payment_requests e /payment_receipts · linhas 4192–4412; FINANCIAL_CONTRACT_1_51.md",
  },
  creditos: {
    lead: "Notas de crédito e wallets ajustam o valor devido por mecanismos diferentes: a nota atua contra uma fatura e suas fees; a wallet representa créditos e transações de saldo com taxa de conversão e prioridade próprias.",
    operations: [
      { method: "POST", path: "/credit_notes", input: "CreditNoteCreateInput", purpose: "Cria um ajuste vinculado a uma fatura e suas fees." },
      { method: "POST", path: "/credit_notes/estimate", input: "CreditNoteEstimateInput", purpose: "Estima limites creditáveis, reembolsáveis e compensáveis antes da emissão." },
      { method: "POST", path: "/wallets", input: "WalletCreateInput", purpose: "Cria uma wallet com crédito pago ou concedido para um cliente." },
      { method: "GET", path: "/wallet_transactions", input: "wallet_id · page · per_page", purpose: "Lista a trilha de funding, consumo e expiração de créditos." },
    ],
    prerequisites: [
      "Para nota de crédito, referenciar invoice_id e cada fee_id com amount_cents explícito.",
      "Equilibrar crédito, reembolso e offset dentro do total de fees e impostos da fatura relacionada.",
      "Para wallet, informar rate_amount, currency e external_customer_id; usar paid_credits ou granted_credits conforme a regra contratual.",
    ],
    transitions: ["Fatura e fee", "Nota de crédito ou saldo", "Transação de wallet", "Valor devido ajustado"],
    exception: "Não use uma wallet como substituto de nota de crédito. Ajustes em faturas e créditos pré-pagos têm evidências, limites e efeitos de reconciliação distintos.",
    snippet: `POST /credit_notes/estimate\n\n{\n  "credit_note": {\n    "invoice_id": "<lago-invoice-id>",\n    "items": [{ "fee_id": "<fee-id>", "amount_cents": 100 }]\n  }\n}\n\n# Estime antes de decidir crédito, reembolso ou offset.`,
    source: "OpenAPI 1.51.0 · /credit_notes, /wallets e /wallet_transactions · linhas 1392–1788 e 6232–6670; FINANCIAL_CONTRACT_1_51.md",
  },
};

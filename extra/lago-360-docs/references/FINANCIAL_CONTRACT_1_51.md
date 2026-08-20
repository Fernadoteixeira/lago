# Contrato financeiro canônico — Lago API 1.51.0

> **Fonte primária:** bundle OpenAPI 3.1.0 preservado em `/home/ubuntu/lago-openapi-extracted.yaml`. As linhas indicadas referem-se a esse bundle local e devem ser atualizadas quando a versão contratual mudar.

## Superfícies de fechamento

| Domínio | Operações canônicas observadas | Evidência no bundle |
|---|---|---|
| Faturas | Criar one-off, listar, recuperar, atualizar, finalizar, refresh, retry de geração, retry de pagamento, URL de pagamento, preview, void e download | `/invoices` e subrotas, linhas 3708–4164 |
| Pagamentos | Criar pagamento manual, listar e recuperar pagamento | `/payments`, linhas 4332–4412 |
| Solicitações de pagamento | Criar para cobrar faturas vencidas de um cliente, listar e recuperar | `/payment_requests`, linhas 4245–4331 |
| Comprovantes | Listar e recuperar comprovantes por fatura | `/payment_receipts`, linhas 4192–4244 |
| Notas de crédito | Criar, estimar, recuperar, download, void e metadados | `/credit_notes` e subrotas, linhas 1392–1788 |
| Wallets e transações | Criar/listar/recuperar wallets; listar transações, funding, consumption e URL de pagamento | `/wallets` e `/wallet_transactions`, linhas 6232–6670 |

## Invariantes observadas

1. A listagem de faturas admite estados `draft`, `finalized`, `failed`, `pending` e `voided`, além de estados de pagamento `pending`, `failed` e `succeeded` (linhas 3779–3806).
2. Uma fatura `draft` pode ser excluída; uma `finalized` deve ser anulada em vez de removida (linhas 3939–3957).
3. A anulação sem corpo exige fatura `finalized` e pagamento diferente de `succeeded`; a anulação com geração de nota de crédito possui regra própria (linhas 4135–4164).
4. A criação de nota de crédito exige `invoice_id` e itens com `fee_id` e `amount_cents`. Os valores de crédito, reembolso e offset devem se equilibrar e não podem ultrapassar o total da fatura (linhas 14196–14275).
5. Uma wallet exige `rate_amount`, `currency` e `external_customer_id`; `paid_credits` é exigido quando não há `granted_credits`, e vice-versa (linhas 16159–16212).
6. `invoice_requires_successful_payment` controla se a emissão da fatura de top-up aguarda pagamento bem-sucedido (linhas 16224–16227).

## Limites do exemplo local

Os exemplos deste corte não chamam endpoints de escrita. Eles validam envelopes, relações causais e invariantes de reconciliação contra esta referência, mantendo `LAGO_API_KEY` e qualquer identificador real fora do repositório.

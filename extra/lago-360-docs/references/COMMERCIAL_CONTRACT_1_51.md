# Evidência canônica — fluxo comercial Lago API 1.51.0

**Fonte preservada:** `/home/ubuntu/lago-openapi-extracted.yaml`, bundle OpenAPI 3.1.0 da API Lago 1.51.0. A documentação de interface, os exemplos e os testes deste corte devem se manter alinhados a estas operações, sem inferir campos ausentes do contrato.

## Métricas faturáveis

| Operação | Método e caminho | Schema de entrada | Evidência |
|---|---|---|---|
| Criar métrica | `POST /billable_metrics` | `BillableMetricCreateInput` | Linhas 976–1001 |
| Listar métricas | `GET /billable_metrics` | paginação `page` e `per_page` | Linhas 1002–1019 |
| Avaliar expressão | `POST /billable_metrics/evaluate_expression` | `BillableMetricEvaluateExpressionInput` | Linhas 1020–1046 |
| Atualizar métrica | `PUT /billable_metrics/{code}` | `BillableMetricUpdateInput` | Linhas 1047–1068 |

O envelope de criação exige `billable_metric`; seu objeto exige `name`, `code` e `aggregation_type`. Para agregações de soma, máximo, contagem única, soma ponderada e último valor, o contrato declara as opções `sum_agg`, `max_agg`, `unique_count_agg`, `weighted_sum_agg` e `latest_agg`; `count_agg` não exige `field_name`. Evidência: linhas 11891–11900 e 11860–11885.

## Planos e charges

| Operação | Método e caminho | Schema de entrada | Evidência |
|---|---|---|---|
| Criar plano | `POST /plans` | `PlanCreateInput` | Linhas 4414–4441 |
| Listar planos | `GET /plans` | paginação `page` e `per_page` | Linhas 4442–4459 |
| Consultar/atualizar plano | `GET` ou `PUT /plans/{code}` | `PlanUpdateInput` no `PUT` | Linhas 4460–4513 |
| Criar charge | `POST /plans/{code}/charges` | schema referenciado pelo contrato | Início na linha 4832 |
| Filtros de charge | `/plans/{code}/charges/{charge_code}/filters` | operações de filtro | Índice na linha 4955 |
| Fixed charges | `/plans/{code}/fixed_charges` | operações de cobrança fixa | Índice na linha 5080 |

O envelope `PlanCreateInput` exige `plan`; o plano exige `name`, `code`, `interval`, `amount_cents`, `amount_currency` e `pay_in_advance`. Cada charge em linha exige `billable_metric_id` e `charge_model`. O contrato também expressa compatibilidade entre `pay_in_advance`, `invoiceable` e `regroup_paid_fees`. Evidência: linhas 19912–20031.

## Assinaturas

| Operação | Método e caminho | Observação contratual | Evidência |
|---|---|---|---|
| Criar assinatura | `POST /subscriptions` | vincula cliente externo, plano e ciclo comercial | Índice na linha 5203 |
| Consultar/atualizar assinatura | `/subscriptions/{external_id}` | usa a identidade externa da assinatura | Índice na linha 5294 |
| Consultar uso acumulado | `GET /subscriptions/{external_id}/lifetime_usage` | expõe uso da assinatura | Índice na linha 5440 |
| Ajustar charges da assinatura | `/subscriptions/{external_id}/charges` | operações no escopo da assinatura | Índice na linha 5818 |

O envelope `SubscriptionCreateInput` exige `subscription`; a assinatura exige `external_customer_id`, `plan_code` e `external_id`. `external_id` é descrito como chave de idempotência; `plan_code` deve apontar para um plano ativo. O ciclo pode ser `calendar` ou `anniversary`, e `subscription_at` deve estar em UTC ISO 8601. Evidência: linhas 21215–21258.

> O contrato declara `bearerAuth` como segurança global e os servidores US e EU em suas linhas 11–17 e 23172–23175. Nenhuma chave deve ser persistida na documentação ou no frontend.

## Pré-condição de cliente e modelos de charge

`CustomerCreateInput` exige o envelope `customer` e `external_id`; esse identificador é fornecido pelo sistema integrador e será referenciado pela assinatura. Evidência: linhas 14575–14587.

`ChargeModelEnum` permite `dynamic`, `graduated`, `graduated_percentage`, `package`, `percentage`, `standard` e `volume`. O exemplo do corte usa `graduated`, uma opção declarada no contrato. Evidência: linhas 18945–18962.

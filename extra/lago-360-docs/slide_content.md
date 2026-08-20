## Cover

# Lago Billing: eventos em lote e pricing por uso

## Da telemetria de consumo à fatura, com previsibilidade operacional

## Slide 1

# Um evento percorre uma cadeia de cobrança

- **Evento de uso:** a aplicação envia consumo associado à assinatura externa e ao código de métrica.
- **Metering:** o Lago agrega o consumo conforme a billable metric ativa.
- **Pricing:** a charge do plano interpreta a quantidade pelos thresholds configurados.
- **Fatura:** fees acumuladas formam linhas faturáveis no ciclo da assinatura.

> Pergunta operacional: “qual payload gerou qual fee e em qual invoice?”

## Slide 2

# Batch events agrupam ingestão, não a semântica

- O endpoint é **POST `/events/batch`** e recebe um objeto com a chave obrigatória `events`.
- Uma requisição suporta **até 100 eventos**; o limite reduz overhead de rede sem alterar a validação de cada item.
- Cada item precisa continuar completo: `transaction_id`, `external_subscription_id` e `code` são obrigatórios.
- A inclusão em lote não converte eventos distintos em uma única medida: a agregação ocorre na billable metric.

## Slide 3

# O contrato mínimo conecta uso, assinatura e métrica

```json
{
  "events": [
    {
      "transaction_id": "evt-2026-0001",
      "external_subscription_id": "sub-acme-pro",
      "code": "api_calls",
      "timestamp": "1786805400.125",
      "properties": { "requests": 250 }
    }
  ]
}
```

- `transaction_id` é o identificador de idempotência do evento.
- `code` deve apontar para uma billable metric ativa; um código sem métrica ativa é ignorado no processamento.
- `properties` passa a ser obrigatória em métricas `sum_agg`, `max_agg` ou `unique_count_agg`; em `count_agg`, pode ser omitida.

## Slide 4

# Aceito agora; processado de forma assíncrona

- A resposta **200** devolve a coleção de eventos recebidos.
- O campo `lago_customer_id` retorna `null` nesse momento porque o processamento é assíncrono.
- Um batch bem-sucedido confirma recepção, não a disponibilidade imediata do dado em fee, usage ou invoice.
- Para auditoria, mantenha a associação entre `transaction_id`, assinatura externa, timestamp e resposta da API.

## Slide 5

# Falhas devem ser tratadas por transaction_id

- `invalid_code`: a métrica indicada não é válida para o fluxo.
- `missing_aggregation_property`: faltou a propriedade exigida pela agregação da métrica.
- `invalid_filter_values`: os atributos do evento não atendem aos filtros de pricing.
- `missing_group_key`: categoria legada, mantida no contrato como depreciada.

> Padrão recomendado: reenviar somente os itens corrigidos, com novos `transaction_id` quando a política de idempotência exigir.

## Slide 6

# A métrica decide o que é cobrável

- **Count:** mede número de ocorrências; útil para chamadas de API, tarefas ou assentos ativos.
- **Sum:** soma uma propriedade numérica; útil para GB armazenados, minutos, tokens ou valor transacionado.
- **Max e unique count:** permitem cobrar pico ou entidades únicas quando o modelo de produto exige essa semântica.
- A charge referencia a métrica pelo `billable_metric_id` e define como a quantidade agregada será precificada.

## Slide 7

# Graduated cobra cada faixa incrementalmente

| Faixa | Quantidade cobrada | Tarifa por unidade |
|---|---:|---:|
| 0–100 | até 100 unidades | US$ 0,10 |
| 101–500 | unidades 101 a 500 | US$ 0,08 |
| 501+ | excedente | US$ 0,05 |

- As faixas devem começar em `0` ou em `to_value + 1` da faixa anterior.
- A última faixa usa `to_value: null`.
- Em **450 unidades**, o cálculo é `100 × 0,10 + 350 × 0,08 = US$ 38,00`.

## Slide 8

# Volume aplica uma única tarifa à quantidade total

| Faixa alcançada | Tarifa aplicada a todas as unidades |
|---|---:|
| 0–100 | US$ 0,10 |
| 101–500 | US$ 0,08 |
| 501+ | US$ 0,05 |

- A estrutura de faixas também é contínua e termina com `to_value: null`.
- O preço da faixa atingida vale para **todo** o volume do período, não apenas para o excedente.
- Em **450 unidades**, o cálculo é `450 × 0,08 = US$ 36,00`.

## Slide 9

# O modelo muda a curva de receita

| Uso no período | Graduated | Volume | Diferença |
|---|---:|---:|---:|
| 450 unidades | US$ 38,00 | US$ 36,00 | US$ 2,00 |
| 650 unidades | US$ 49,50 | US$ 32,50 | US$ 17,00 |

- **Graduated** preserva receita incremental e produz uma curva suave.
- **Volume** incentiva o alcance de thresholds, mas cria degraus de preço que precisam ser comunicados ao cliente.
- A decisão é de produto e política comercial, não apenas de implementação.

## Slide 10

# A charge é configurada dentro do plano

```json
{
  "plan": {
    "name": "Pro Usage",
    "code": "pro-usage",
    "interval": "monthly",
    "amount_cents": 0,
    "amount_currency": "USD",
    "pay_in_advance": false,
    "charges": [{
      "billable_metric_id": "<metric-uuid>",
      "charge_model": "graduated",
      "invoiceable": true,
      "pay_in_advance": false,
      "properties": { "graduated_ranges": ["…"] }
    }]
  }
}
```

- O plano exige `name`, `code`, `interval`, `amount_cents`, `amount_currency` e `pay_in_advance`.
- Para charge de uso, `billable_metric_id` e `charge_model` são obrigatórios.
- `invoiceable`, `pay_in_advance`, `prorated` e `min_amount_cents` definem o comportamento de faturamento.

## Slide 11

# Controle operacional evita surpresas na fatura

- Gere IDs de transação rastreáveis e preserve request/response de lote para reconciliação.
- Valide métricas, propriedades e filtros antes de escalar o batch para produção.
- Simule os thresholds contra padrões reais de uso antes de publicar uma charge.
- Monitore current usage, projected usage, fees e faturas como uma cadeia única de evidências.

### Fontes

OpenAPI Lago API 1.51.0 — `POST /events/batch`, `EventInputObject`, `ChargeProperties` e `PlanCreateInput`.

Documentação oficial Lago — modelos **graduated** e **volume**.

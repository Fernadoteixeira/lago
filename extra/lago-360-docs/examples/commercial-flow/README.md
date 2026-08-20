# Fluxo comercial canônico

Este diretório demonstra uma cadeia comercial segura e reproduzível: **cliente → métrica faturável → plano com charge graduada → assinatura → evento de uso**. Os payloads refletem o recorte preservado do OpenAPI Lago 1.51.0 em `references/COMMERCIAL_CONTRACT_1_51.md`.

| Etapa | Identidade estável | Resultado esperado |
|---|---|---|
| Cliente | `LAGO_CUSTOMER_ID` | Cliente externo que será faturado. |
| Métrica | `LAGO_METRIC_CODE` | Medição que interpreta o evento. |
| Plano | `LAGO_PLAN_CODE` | Política de cobrança com charge graduada. |
| Assinatura | `LAGO_SUBSCRIPTION_ID` | Vínculo comercial idempotente. |
| Evento | `LAGO_EVENT_TRANSACTION_ID` | Uso aceito uma única vez pela transação. |

## Validação sem rede

Execute a validação local antes de enviar qualquer tráfego. Ela verifica os envelopes e invariantes cobertos pelo recorte contratual, incluindo agregação, charge model, identificadores externos e os campos obrigatórios de cada criação.

```bash
node examples/commercial-flow/validate-contract.mjs
```

## Execução explícita

Os dois exemplos bloqueiam chamadas de escrita até que `LAGO_ALLOW_WRITE=true` seja informado. Não salve a chave no repositório. Use um ambiente de teste e identificadores exclusivos do seu tenant.

```bash
export LAGO_API_KEY='<bearer-token>'
export LAGO_ALLOW_WRITE=true
export LAGO_CUSTOMER_ID='docs-acme-001'
export LAGO_METRIC_CODE='docs_api_calls'
export LAGO_PLAN_CODE='docs_pro_monthly'
export LAGO_SUBSCRIPTION_ID='docs-sub-acme-pro-001'
export LAGO_EVENT_TRANSACTION_ID='docs-event-acme-pro-001'

node examples/commercial-flow/commercial-flow.mjs
# ou
python3 examples/commercial-flow/commercial_flow.py
```

> A execução é idempotente no recorte documentado: se a criação retornar conflito, o exemplo consulta o recurso pelo identificador estável e continua. O evento conserva `transaction_id`; não o altere em um retry.


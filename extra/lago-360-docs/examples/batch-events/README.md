# Eventos em lote — exemplos executáveis

Estes exemplos enviam até 100 eventos para `POST /events/batch`, separam os itens aceitos das falhas por `transaction_id` e exibem somente os IDs que exigem correção antes de um retry. Eles usam o contrato Lago API 1.51.0 e não contêm chaves ou identificadores reais.

> Execute apenas em um ambiente no qual os códigos de métrica, a assinatura e os `transaction_id` de demonstração sejam seguros. A idempotência depende de manter cada `transaction_id` estável em reenvios.

| Variável | Finalidade | Exemplo |
|---|---|---|
| `LAGO_API_URL` | Base regional da API | `https://api.getlago.com/api/v1` ou `https://api.eu.getlago.com/api/v1` |
| `LAGO_API_KEY` | Chave bearer de ambiente | Nunca registre este valor em logs ou no repositório. |
| `LAGO_SUBSCRIPTION_ID` | ID externo da assinatura | `sub_acme_pro` |
| `LAGO_METRIC_CODE` | Código de métrica faturável ativo | `api_calls` |

## Node.js

```bash
export LAGO_API_KEY='…'
export LAGO_SUBSCRIPTION_ID='sub_acme_pro'
export LAGO_METRIC_CODE='api_calls'
node examples/batch-events/batch-events.mjs
```

## Python

```bash
export LAGO_API_KEY='…'
export LAGO_SUBSCRIPTION_ID='sub_acme_pro'
export LAGO_METRIC_CODE='api_calls'
python3 examples/batch-events/batch_events.py
```

Os dois scripts encerram com erro quando a API retornar erro HTTP. Uma resposta de lote que contenha itens inválidos continua sendo tratada como diagnóstico de negócio: os itens aceitos não são reenviados, e a lista de pendências é impressa para correção seletiva.

# Reconciliação financeira canônica

Este diretório demonstra uma **reconciliação local** entre fatura, pagamento, nota de crédito e wallet. Ele não envia chamadas para a API do Lago e não exige `LAGO_API_KEY`.

## Objetivo

O exemplo valida os envelopes mínimos preservados no contrato OpenAPI 1.51.0 e aplica invariantes locais de reconciliação: o pagamento não pode exceder o valor da fatura, a distribuição da nota de crédito deve equilibrar seus itens e uma wallet precisa ter créditos pagos ou concedidos.

```bash
pnpm test:financial-contract
node examples/financial-reconciliation/reconcile.mjs
python3 examples/financial-reconciliation/reconcile.py
```

O arquivo [`references/FINANCIAL_CONTRACT_1_51.md`](../../references/FINANCIAL_CONTRACT_1_51.md) contém a proveniência das rotas e regras apresentadas aqui.

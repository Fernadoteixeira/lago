---
name: lago-billing-docs
description: Criar, atualizar, localizar e integrar documentação técnica do Lago Billing baseada em OpenAPI, incluindo exemplos Python/Node.js, explicações de batch events e cobrança por uso, interface React, roteiros de slides, proveniência e CI/CD. Use quando a tarefa envolver documentação do Lago, API de metering e billing, `openapi.yaml`, SDKs do Lago, `extra/lago-360-docs/`, ou publicação dessas docs em um fork GitHub.
---

# Documentação Lago Billing

Use esta skill para produzir documentação operacional verificável do Lago. Preserve o contrato como fonte de verdade, diferencie fatos da API de simulações didáticas e mantenha o código de documentação isolado do core do produto.

## Fluxo de decisão

1. **Nova documentação ou atualização de contrato?** Siga o fluxo completo abaixo.
2. **Apenas tradução ou ajuste editorial?** Releia o contrato e preserve paths, nomes de campos, métodos HTTP, códigos e identificadores técnicos; altere só a linguagem da interface e da narrativa.
3. **Integração em fork?** Aplique também a seção “Integração e publicação”.
4. **Slides ou roteiro?** Use a seção “Narrativa de apresentação” e mantenha o deck em até 12 páginas, salvo se a conta permitir mais.

## Fluxo completo

1. **Estabeleça proveniência.** Recupere o bundle OpenAPI oficial e fontes documentais públicas. Registre URL, versão de API, versão OpenAPI, data de coleta, tamanho e SHA-256. Preserve os raws sem edição em uma árvore `references/raw/`.
2. **Faça o inventário.** Conte paths e operações a partir do bundle e registre os domínios necessários: eventos, billable metrics, planos, charges, assinaturas, customers, invoices, wallets, pagamentos e analytics. Não invente endpoints ou campos ausentes do schema.
3. **Derive exemplos executáveis.** Gere clientes ou exemplos Python e Node.js diretamente do contrato. Inclua autenticação por variável de ambiente, método HTTP, path, payload, tratamento de erro e uma chamada de exemplo. Não embuta segredos.
4. **Explique a cadeia de cobrança.** Relacione evento → métrica → charge → fee → fatura. Diferencie transporte de evento, agregação de métrica e regra de preço.
5. **Trate batch events com precisão.** Para `POST /events/batch`, explique que o lote agrupa transporte e não cria agregação implícita. Mostre o envelope `events`, os campos por item, o limite documentado, a resposta assíncrona, a idempotência por `transaction_id` e o tratamento seletivo de erros.
6. **Modele cobrança por uso.** Documente graduated e volume em separado. Em graduated, cada faixa cobra o trecho correspondente; em volume, a faixa alcançada define a tarifa aplicada à quantidade elegível. Identifique todos os exemplos numéricos como didáticos, cite a fonte e exponha as fórmulas.
7. **Construa a interface.** Use a interface para reduzir o caminho entre uma pergunta operacional e o contrato correspondente. Inclua filtros por domínio, busca por operação, payloads legíveis, simulador e proveniência. Mantenha ativos e screenshots versionados quando a publicação não puder depender de armazenamento temporário.
8. **Localize com segurança.** Traduza textos visíveis, `aria-*`, `alt`, placeholders, títulos e metadados para pt-BR quando solicitado. Não traduza valores de schema, endpoints, propriedades JSON, nomes de modelos ou identificadores.
9. **Valide antes de integrar.** Execute o instalador reproduzível, a verificação de tipos e o build de produção. Registre resultados, avisos não bloqueantes e limitações conhecidas.

## Guardrails técnicos

| Área | Regra |
|---|---|
| Fonte de verdade | Priorize o bundle `getlago/lago-openapi`; use documentação pública para explicar sem contradizer o schema. |
| Exemplos | Preserve `transaction_id`, `external_subscription_id`, `code`, timestamp e propriedades compatíveis com a agregação. |
| Pricing | Não apresente graduated e volume como equivalentes: apresente a regra, a fórmula e o efeito comercial. |
| Dados numéricos | Cite a fonte; marque tabelas de simulação como didáticas. |
| Raws | Nunca regrave, normalize ou substitua o original; crie derivados em diretórios separados. |
| Interface | Não use links de ativos temporários em artefatos destinados a GitHub Pages. Resolva ativos com a base do Vite. |

## Integração e publicação

1. Inspecione o remoto, a branch de destino e o estado do fork antes de editar.
2. Materialize a documentação sob `extra/lago-360-docs/`; não modifique o core do Lago para acomodar conteúdo editorial.
3. Para GitHub Pages no repositório `Fernadoteixeira/lago`, construa com `VITE_BASE_PATH=/lago/` e publique `dist/public` com `actions/upload-pages-artifact` e `actions/deploy-pages`.
4. Configure o workflow para validar somente mudanças em `extra/lago-360-docs/**` e no arquivo de workflow. Use `pnpm install --frozen-lockfile`, `pnpm check` e `pnpm build`.
5. Antes do primeiro deploy, confirme que GitHub Pages está configurado para **GitHub Actions** por uma conta com permissão administrativa. Se a credencial disponível não puder ativar Pages, documente a etapa manual em vez de simular sucesso.
6. Revise `git diff`, faça um commit descritivo e envie somente depois de os testes locais passarem. Inclua o hash do commit no resumo de entrega.

## Narrativa de apresentação

Estruture a apresentação como uma história operacional: isolamento da documentação, Atlas de Operação e localização, fontes e proveniência, evento até fatura, batch events, agregação, comparação de pricing, configuração de charge, explorador OpenAPI, validação e automação. Para cada slide, forneça título, uma ideia central, no máximo quatro evidências e notas de fala. Cite OpenAPI e docs oficiais para limites, schemas e modelos de cobrança.

## Validação final

Execute e reporte a matriz abaixo antes da entrega.

| Verificação | Resultado esperado |
|---|---|
| Integridade dos raws | Inventário e SHA-256 preservados |
| Contrato | Endpoints, métodos, campos e limites conferidos no OpenAPI |
| Interface | Navegação, simulador e exploração de operações em funcionamento |
| Localização | pt-BR nativo sem alteração de contratos técnicos |
| Build | `pnpm check` e `pnpm build` aprovados |
| CI/CD | Workflow versionado e artefato Pages apontando para `dist/public` |
| Entrega | Roteiro, referências, commit e limitações administrativas explícitos |

## Referências primárias

- [Lago OpenAPI](https://github.com/getlago/lago-openapi)
- [Schema EventBatchInput](https://github.com/getlago/lago-openapi/blob/main/src/schemas/EventBatchInput.yaml)
- [Modelo graduated](https://getlago.com/docs/guide/plans/charges/charge-models/graduated)
- [Modelo volume](https://getlago.com/docs/guide/plans/charges/charge-models/volume)

# Roteiro de apresentação — Lago 360º integrado ao fork

Este roteiro foi criado para explicar a estrutura materializada em `extra/lago-360-docs/`, sua separação do código principal do Lago e os controles de validação aplicados antes do commit em `main`.

## Cover

**Lago 360º Billing Docs**

**Documentação operacional integrada ao fork, sem interferir no core**

## Slide 1 — A documentação vive ao lado do produto, não dentro do core

- A integração está isolada em `extra/lago-360-docs/` no fork `Fernadoteixeira/lago`.
- A árvore original do Lago permanece inalterada; o Git registra apenas o novo diretório.
- O isolamento torna a documentação revisável, removível e evolutiva sem acoplar mudanças à API principal.

## Slide 2 — Uma estrutura preparada para leitura e execução

- `client/` contém a interface React de navegação, comparador de pricing e explorador OpenAPI.
- `references/` preserva fontes, raws, screenshots e metadados de proveniência.
- `DESIGN.md` e `ideas.md` mantêm as decisões visuais e editoriais reproduzíveis.
- `slide_content.md` e este roteiro transformam a implementação em narrativa de apresentação.

## Slide 3 — O Atlas de Operação organiza a leitura 360º

- A experiência segue uma navegação por estágios: visão geral, batch events, modelos de cobrança, OpenAPI e proveniência.
- O leitor acompanha o caminho operacional de evento para métrica, charge, fee e fatura.
- Tipografia técnica, tabelas densas e módulos assimétricos priorizam rastreabilidade em vez de marketing genérico.

## Slide 4 — Eventos em lote são o ponto de entrada do uso

- `POST /events/batch` aceita um envelope com até 100 eventos por requisição.
- Cada evento carrega `transaction_id`, `external_subscription_id`, `code` e um `properties` opcional.
- A resposta separa eventos aceitos e erros por identificador de transação, permitindo reconciliação e reenvio seletivo. [1]

## Slide 5 — Métricas traduzem telemetria em unidades faturáveis

- Uma métrica faturável define como os eventos são agregados para a cobrança.
- O evento mantém o dado bruto; a métrica estabelece a regra de leitura e o charge associa a regra a um plano.
- Essa separação permite alterar precificação sem reescrever o pipeline de telemetria.

## Slide 6 — Graduated e volume respondem a perguntas diferentes

- **Graduated:** cada faixa cobra apenas as unidades dentro do seu intervalo; o total é acumulado por degraus.
- **Volume:** a faixa atingida define o preço aplicado a todas as unidades elegíveis do período.
- A interface compara os dois modelos com uma simulação de 450 unidades e deixa explícita a diferença de regra, não apenas de preço. [2] [3]

## Slide 7 — O explorador OpenAPI transforma contrato em navegação

- A página apresenta os caminhos por domínio, método HTTP e descrição operacional.
- Batch events, métricas, planos, assinaturas, faturas, wallets, pagamentos e analytics podem ser filtrados em uma única leitura.
- O bundle OpenAPI preservado serve como fonte de verdade para exemplos e futuras atualizações da interface. [4]

## Slide 8 — Proveniência torna a documentação auditável

- Os HTMLs de referência e os schemas OpenAPI foram preservados como raws com inventário e checksums.
- A documentação separa material de origem, transformação visual e interpretação editorial.
- Essa trilha permite verificar de onde cada afirmação e cada exemplo foram derivados.

## Slide 9 — O sandbox funciona como gate antes da main

- A integração foi clonada e materializada localmente antes de qualquer publicação remota.
- `pnpm install --frozen-lockfile`, `pnpm check` e `pnpm build` foram executados no diretório integrado.
- A checagem de tipos e o build de produção concluíram sem erros; o aviso de tamanho de chunk é uma oportunidade de otimização, não um bloqueio.

## Slide 10 — A main recebe uma unidade coesa e independente

- O commit registra somente `extra/lago-360-docs/` e preserva as áreas existentes do fork.
- A estrutura é imediatamente navegável por revisores e não exige mudanças no runtime do Lago.
- A próxima evolução pode incluir atualização automatizada do bundle OpenAPI e publicação da interface em ambiente próprio.

## Closing

**Do evento bruto à evidência de cobrança — com contrato, contexto e proveniência.**

## Referências

[1]: [Schema EventBatchInput — getlago/lago-openapi](https://github.com/getlago/lago-openapi/blob/main/src/schemas/EventBatchInput.yaml)

[2]: [Lago Docs — Graduated charge model](https://getlago.com/docs/guide/plans/charges/charge-models/graduated)

[3]: [Lago Docs — Volume charge model](https://getlago.com/docs/guide/plans/charges/charge-models/volume)

[4]: [Bundle OpenAPI — getlago/lago-openapi](https://github.com/getlago/lago-openapi/blob/main/openapi.yaml)

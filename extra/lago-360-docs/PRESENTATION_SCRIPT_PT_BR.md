# Roteiro completo — Lago 360º Billing Docs

Este roteiro apresenta a documentação materializada em `extra/lago-360-docs/` para lideranças de produto, engenharia, operações de receita e desenvolvimento. A narrativa cabe em **12 páginas**, incluindo abertura e encerramento, e conecta o contrato OpenAPI à operação de cobrança, à interface em pt-BR e ao ciclo de publicação.

## Cover

**Lago 360º Billing Docs**

**Do evento de produto à evidência de cobrança, em português do Brasil e com proveniência verificável.**

## Slide 1

### A documentação evolui ao lado do core

| Elemento | Mensagem no slide |
|---|---|
| Localização | `extra/lago-360-docs/` no fork `Fernadoteixeira/lago` |
| Limite de mudança | O código principal do Lago não foi alterado |
| Resultado | Um artefato revisável, removível e versionável de forma independente |

**Roteiro do apresentador.** “Começamos com uma decisão de arquitetura editorial: a documentação não invade o core do Lago. Ela vive em `extra/lago-360-docs/`, com a própria interface, referências e instruções de automação. Isso preserva o produto principal e torna a experiência documental uma unidade fácil de revisar e evoluir.”

**Transição.** “Com o lugar definido, vamos olhar a forma como essa unidade organiza a leitura.”

## Slide 2

### Atlas de Operação traduz contrato em contexto

| Camada | Decisão implementada |
|---|---|
| Idioma | Textos visíveis, atributos de acessibilidade e metadados em pt-BR |
| Navegação | Visão geral, eventos em lote, modelos de precificação, OpenAPI e proveniência |
| Direção visual | Papel mineral, azul-petróleo e lima de sinal; Space Grotesk, Source Sans 3 e IBM Plex Mono |

**Roteiro do apresentador.** “A aplicação localizada não é apenas uma tradução de rótulos. Ela é um Atlas de Operação: cada seção responde a uma pergunta de quem precisa entender como o consumo atravessa regras e vira uma cobrança. A hierarquia visual, definida em `DESIGN.md` e `ideas.md`, foi concebida para priorizar rastreabilidade e decisões operacionais, não uma landing page genérica.”

**Transição.** “Essa leitura só é confiável quando o material que a sustenta pode ser verificado.”

## Slide 3

### OpenAPI e raws formam a trilha de evidência

| Fonte preservada | Função no projeto |
|---|---|
| Bundle OpenAPI 3.1.0, API 1.51.0 | Fonte de verdade para caminhos, operações, schemas e exemplos |
| HTMLs oficiais e screenshots renderizados | Referência visual e editorial preservada |
| Inventário e SHA-256 | Verificação de integridade e proveniência |

**Roteiro do apresentador.** “A cobertura 360º começa pela fonte. O bundle oficial expõe 122 caminhos e 202 operações; ele orienta o explorador da interface e os exemplos técnicos. Os HTMLs e capturas de referência foram mantidos como raws, acompanhados de metadados e checksums. Assim, toda afirmação importante pode ser rastreada da interface de volta ao contrato ou à fonte preservada.” [1]

**Transição.** “Com essa base, agora seguimos uma única unidade de uso até a fatura.”

## Slide 4

### Um evento percorre cinco estágios de cobrança

| Estágio | Pergunta que deve ser respondida |
|---|---|
| Evento | Qual consumo foi enviado e com qual `transaction_id`? |
| Métrica | Como o dado foi agregado em quantidade faturável? |
| Charge | Qual regra de preço interpreta a quantidade? |
| Fee | Qual valor foi acumulado pela regra? |
| Fatura | Em qual documento financeiro o valor aparece? |

**Roteiro do apresentador.** “A cadeia é deliberadamente simples: evento, métrica, charge, fee e fatura. O valor do Atlas está em manter o vínculo entre essas cinco etapas. A pergunta operacional não é apenas ‘quanto cobrar?’, mas ‘qual payload gerou qual fee e em qual invoice?’. Essa mudança de pergunta cria condições para reconciliação e suporte.”

**Transição.** “O primeiro estágio dessa cadeia é a ingestão dos eventos.”

## Slide 5

### Lotes reduzem transporte, não semântica

| Contrato de batch events | Implicação operacional |
|---|---|
| `POST /events/batch` | Envia uma coleção sob a chave obrigatória `events` |
| Até 100 eventos por requisição | Menos overhead de rede sem agregação implícita |
| Identificadores do item | `transaction_id`, `external_subscription_id` e `code` conectam uso, assinatura e métrica |

**Roteiro do apresentador.** “Eventos em lote devem ser entendidos como um envelope de transporte. O endpoint recebe até 100 eventos, mas cada item continua semanticamente completo. O Lago não soma o lote por si só: a agregação pertence à billable metric. Por isso, a aplicação apresenta o contrato, o limite e a sequência de interpretação como partes distintas.” [2]

**Transição.** “Depois da recepção, a atenção muda para o estado de processamento e para a qualidade do dado.”

## Slide 6

### Receber não é faturar; erros são item a item

| Situação | Leitura correta |
|---|---|
| Resposta HTTP 200 | A API aceitou a ingestão; o processamento é assíncrono |
| `lago_customer_id: null` | A correlação de cliente ainda pode ocorrer no pipeline posterior |
| `invalid_code` ou propriedade ausente | Corrigir e tratar seletivamente pelo `transaction_id` |

**Roteiro do apresentador.** “Uma resposta 200 confirma que a requisição chegou, não que uma fee já esteja pronta ou que uma invoice tenha sido atualizada. A documentação torna essa diferença explícita e mostra falhas por item, para que a correção não replique o que já foi aceito. O controle operacional recomendado é preservar request, response, assinatura externa e timestamp junto com o identificador de transação.” [2]

**Transição.** “Quando o evento está correto, a métrica define o que será efetivamente contado.”

## Slide 7

### A métrica separa telemetria de política de preço

| Tipo de agregação | Exemplo de unidade de produto |
|---|---|
| Count | Chamadas de API, tarefas ou ocorrências |
| Sum | Tokens, minutos, GB ou valores numéricos acumulados |
| Max e unique count | Pico de uso ou entidades únicas no período |

**Roteiro do apresentador.** “O evento mantém telemetria bruta. A billable metric decide como interpretá-la e a charge associa essa quantidade a uma política comercial. Isso permite modificar preço sem reescrever o pipeline de eventos. Quando a métrica usa `sum_agg`, `max_agg` ou `unique_count_agg`, as propriedades necessárias devem estar no evento; em `count_agg`, elas podem ser dispensadas.” [2]

**Transição.** “Depois de medir a quantidade, a escolha passa a ser qual curva de preço usar.”

## Slide 8

### Graduated e volume são políticas diferentes

| Cenário com 450 unidades | Graduated | Volume |
|---|---:|---:|
| Regra | Soma cada faixa incrementalmente | Aplica a tarifa da faixa atingida a todo o volume |
| Faixas didáticas | 0–100: US$ 0,10; 101–500: US$ 0,08; 501+: US$ 0,05 | Mesmas faixas |
| Resultado do simulador | US$ 38,00 | US$ 36,00 |

**Roteiro do apresentador.** “No modelo graduated, as primeiras 100 unidades continuam a US$ 0,10 e apenas o trecho seguinte muda de tarifa. No volume, a faixa alcançada define a tarifa aplicada a todo o consumo elegível. A diferença de US$ 2,00 em 450 unidades é didática, mas evidencia uma escolha real de receita e comunicação com clientes. A interface permite mover o volume e enxergar essa divergência em vez de escondê-la em configuração.” [3] [4]

**Transição.** “Essa política precisa finalmente ser materializada como charge dentro de um plano.”

## Slide 9

### A charge conecta regra de uso ao plano comercial

| Campo de configuração | Papel na cobrança |
|---|---|
| `billable_metric_id` | Relaciona a charge à métrica agregada |
| `charge_model` | Define a interpretação: graduated, volume ou outro modelo permitido |
| `invoiceable`, `pay_in_advance`, `prorated`, `min_amount_cents` | Ajustam o comportamento de faturamento |

**Roteiro do apresentador.** “O plano contém a charge de uso e é o ponto em que a regra técnica se torna política comercial. O roteiro e o explorador mantêm explícitos os campos que conectam a métrica ao modelo de cobrança. Antes de publicar uma charge, a equipe deve simular as faixas com padrões reais de uso, validar filtros e verificar o comportamento de fatura esperado.” [1]

**Transição.** “Para tornar essa consulta repetível, o contrato também foi convertido em uma experiência de navegação.”

## Slide 10

### O explorador reduz a distância até a operação correta

| Recurso da interface | Uso na prática |
|---|---|
| Filtros por domínio | Encontrar eventos, métricas, planos, assinaturas, faturas, wallets, pagamentos e analytics |
| Busca por path ou operação | Acelerar a descoberta de endpoints sem abandonar o contexto da cobrança |
| Proveniência visível | Voltar do exemplo à fonte técnica oficial |

**Roteiro do apresentador.** “O OpenAPI não foi tratado como um arquivo estático. Os caminhos são apresentados por domínio, método e resumo operacional. Isso reduz a distância entre uma pergunta de produto — por exemplo, como consultar uma fatura ou enviar eventos — e a operação de API que responde à pergunta. A fonte continua o bundle OpenAPI preservado; a interface só cria uma camada de leitura.” [1]

**Transição.** “A documentação agora precisa ser mantida com o mesmo rigor aplicado ao contrato.”

## Slide 11

### Validação, deploy e skill tornam o fluxo repetível

| Controle | Implementação |
|---|---|
| CI | `pnpm install --frozen-lockfile`, `pnpm check` e build em cada alteração relevante |
| CD | Artefato estático `dist/public` preparado para GitHub Pages em `/lago/` |
| Reutilização | Skill documenta extração OpenAPI, SDK, interface, integração, localização e automação |

**Roteiro do apresentador.** “O workflow só é acionado quando a documentação integrada ou sua automação muda. Ele valida o lockfile, a tipagem e o build; depois publica apenas o artefato estático para GitHub Pages. Em paralelo, a skill reaproveitável transforma o processo em um procedimento: preservar fontes, derivar SDKs, construir a interface, integrar sem tocar no core e publicar com gates. A evolução deixa de depender de memória de uma única sessão.”

**Transição.** “Esse é o ponto em que a documentação deixa de ser uma entrega isolada e passa a ser um sistema de operação.”

## Closing

**Lago 360º: contrato verificável, operação compreensível e cobrança rastreável.**

## Referências

[1]: [Lago OpenAPI — bundle oficial](https://github.com/getlago/lago-openapi/blob/main/openapi.yaml)

[2]: [Lago OpenAPI — EventBatchInput](https://github.com/getlago/lago-openapi/blob/main/src/schemas/EventBatchInput.yaml)

[3]: [Lago Docs — modelo graduated](https://getlago.com/docs/guide/plans/charges/charge-models/graduated)

[4]: [Lago Docs — modelo volume](https://getlago.com/docs/guide/plans/charges/charge-models/volume)

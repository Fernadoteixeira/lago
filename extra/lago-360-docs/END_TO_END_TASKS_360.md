# Lago 360º — Lista de tarefas end-to-end

> **Objetivo:** transformar a documentação Lago 360º em uma referência auditável para descobrir, implementar, operar e evoluir billing baseado em uso, sem perder a ligação entre contrato OpenAPI, evento de uso, métrica, cobrança, valor, fatura e evidência de origem.

## Estado de partida

O trabalho já materializado cobre o bundle OpenAPI 1.51.0, os raws com proveniência, exemplos iniciais de SDK em Python e Node.js, a interface interativa em pt-BR, o simulador de modelos graduado e por volume, os slides, o roteiro, a skill reutilizável e o workflow de build e deploy. O workflow já validou instalação, checagem de tipos, build, smoke test e artefato; a única dependência administrativa para publicação é habilitar o GitHub Pages no fork e selecionar **GitHub Actions** como origem.

| Marco | Estado | Evidência principal |
|---|---|---|
| Contrato e fontes base | Concluído | Bundle OpenAPI, raws, checksums e inventário preservados |
| Interface documental pt-BR | Concluído | Atlas de Operação, simulador, explorador OpenAPI e referência visual |
| Integração com o fork | Concluído | `extra/lago-360-docs/` na branch `main` |
| Build e artifact de Pages | Concluído | Workflow `Lago 360 Docs` validado em GitHub Actions |
| Deploy público | Dependência externa | Habilitar GitHub Pages no repositório |
| Cobertura funcional completa | Em expansão | Executar as frentes abaixo em ordem de dependência |

## Definição de pronto para cobertura 360º

A cobertura será considerada completa quando **cada área do contrato exposto** possuir uma fonte versionada, explicação de negócio, fluxo operacional, exemplos verificáveis, referências cruzadas na interface, testes de contrato e evidência de publicação. Nenhum exemplo pode esconder comportamento relevante de erro, idempotência, paginação, autenticação ou reconciliação.

| Dimensão | Critério de aceite |
|---|---|
| Rastreabilidade | Cada afirmação técnica aponta para OpenAPI, documentação oficial ou raw preservado. |
| Implementabilidade | Todo fluxo importante tem requisição, resposta, exceção e exemplo em Python e/ou Node.js. |
| Operabilidade | Retentativas, observabilidade, reconciliação, auditoria e limites estão descritos. |
| Usabilidade | A interface tem navegação por domínio, busca, links profundos, responsividade e acessibilidade verificadas. |
| Governança | CI, deploy, inventário de fontes, changelog e matriz de cobertura permanecem atualizados. |

## Onda 0 — Desbloqueio de publicação e governança

Esta onda remove a dependência que impede a entrega pública e estabelece o mecanismo de controle que sustentará as próximas expansões.

- [ ] Habilitar **GitHub Pages** em `Fernadoteixeira/lago` e selecionar **GitHub Actions** em *Settings → Pages*.
- [ ] Reexecutar o workflow `Lago 360 Docs` e registrar a URL pública efetiva da documentação.
- [ ] Validar publicação sob o subcaminho `/lago/`, incluindo JavaScript, CSS, imagens de referência e links internos.
- [ ] Criar um arquivo `COVERAGE_MATRIX.md` com as colunas: domínio, operação OpenAPI, guia, exemplo SDK, teste, fonte e status.
- [ ] Definir responsáveis, revisão técnica e critério de atualização para mudanças no contrato OpenAPI.
- [ ] Criar changelog de documentação, separado do changelog do produto, com versão, data, origem e impacto de cada atualização.
- [ ] Registrar a política de versionamento: versão mínima de API suportada, regiões, compatibilidade e deprecações.

**Evidência de aceite:** deploy ativo, URL testada em navegador, matriz inicial criada e processo de atualização documentado.

## Onda 1 — Fontes, contrato e fundamentos transversais

Antes de aprofundar os domínios, a documentação deve tornar explícitas as regras que todos os consumidores da API compartilham.

- [ ] Atualizar o inventário de raws sempre que houver nova release de `lago-openapi`.
- [ ] Recalcular SHA-256 dos arquivos obtidos e registrar origem, URL, data e versão.
- [ ] Comparar versões OpenAPI e produzir um relatório de mudanças: operações criadas, removidas, alteradas e campos incompatíveis.
- [ ] Documentar URL base por região, headers obrigatórios, autenticação e escopo das chaves de API.
- [ ] Documentar convenções de identificadores internos e externos, incluindo `transaction_id`, `external_customer_id`, `external_subscription_id`, `code` e `lago_id`.
- [ ] Explicar paginação, ordenação, filtros, serialização de datas, casas decimais e valores monetários.
- [ ] Explicar semântica de idempotência por operação e como projetar chaves de transação recuperáveis.
- [ ] Mapear códigos HTTP, estrutura de erros e estratégia de tratamento de falhas para cada classe de resposta.
- [ ] Publicar uma seção de limites, desempenho e práticas de retry com diferenciação entre falhas transitórias e inválidas.

**Evidência de aceite:** guia de fundamentos com exemplos de cabeçalhos, paginação, erro e idempotência, todos associados às fontes preservadas.

## Onda 2 — Eventos, ingestão e medição

Esta onda estabelece a primeira metade da cadeia causal: o evento que representa uso e a regra que o transforma em quantidade faturável.

- [ ] Documentar evento unitário: intenção, payload mínimo, campos opcionais, resposta e consulta por `transaction_id`.
- [ ] Documentar eventos em lote: limite por requisição, envelope, comportamento assíncrono, resposta parcial e reprocessamento seletivo.
- [ ] Criar tabelas de decisão para `invalid_code`, `missing_aggregation_property`, filtros inválidos e itens aceitos.
- [ ] Publicar exemplos de lotes válidos, mistos e inválidos em cURL, Python e Node.js.
- [ ] Documentar o desenho de `billable_metrics`: agregação, propriedade de agregação, filtros, grupos e unidade de medida.
- [ ] Incluir cenário de métrica simples, métrica por propriedade e métrica segmentada por filtros.
- [ ] Explicar ordem operacional entre cliente, assinatura, métrica e evento de uso.
- [ ] Definir estratégia de replay: retenção dos eventos de origem, deduplicação, correlação e auditoria.
- [ ] Criar testes de contrato para payloads de eventos e respostas de erro representativas.
- [ ] Adicionar no Atlas uma trilha navegável **Evento → Métrica**, com links para cada guia e exemplo.

**Evidência de aceite:** um leitor consegue emitir, consultar, diagnosticar e reprocessar um evento sem recorrer a documentação externa.

## Onda 3 — Catálogo comercial, planos e modelos de cobrança

Esta frente transforma quantidade medida em regra comercial configurável e esclarece as diferenças entre modelos de precificação.

- [ ] Documentar criação, consulta, atualização, arquivamento e versionamento de planos.
- [ ] Documentar charges recorrentes, charges por uso e os atributos necessários para associá-las a métricas faturáveis.
- [ ] Documentar o modelo **graduado** com faixas, cálculo incremental, exemplos limítrofes e expressão matemática.
- [ ] Documentar o modelo **por volume** com faixa atingida, tarifa aplicada ao total e exemplos limítrofes.
- [ ] Cobrir outros modelos disponibilizados pelo contrato na versão alvo, sem restringir a documentação aos dois simulados inicialmente.
- [ ] Cobrir preços fixos, taxas mínimas, valores gratuitos, filtros de charge, grupos e regras de pagamento conforme o contrato.
- [ ] Mapear alterações de plano, validade temporal, upgrades, downgrades e impactos na cobrança em curso.
- [ ] Estender o simulador para expor hipótese, arredondamento, moeda e limite de validade de seus números didáticos.
- [ ] Criar snapshots de teste para cada modelo e faixa de uso relevante.
- [ ] Adicionar no Atlas a trilha **Métrica → Charge → Fee**, com links diretos para a operação OpenAPI correspondente.

**Evidência de aceite:** um leitor consegue configurar um plano, justificar a escolha de modelo e reproduzir o resultado do cálculo com dados documentados.

## Onda 4 — Clientes, assinaturas e ciclo de vida comercial

Esta onda conecta a configuração comercial à entidade que efetivamente consome o produto e será faturada.

- [ ] Documentar criação, consulta, atualização e arquivamento de clientes.
- [ ] Documentar metadados de cliente, endereços, moeda, entidade legal e campos usados para faturamento.
- [ ] Documentar criação, consulta, atualização e encerramento de assinaturas.
- [ ] Cobrir início, término, cancelamento, alteração de plano, datas de efetivação e prorrata quando expostos pelo contrato.
- [ ] Documentar consulta de uso acumulado da assinatura e relação com eventos e métricas.
- [ ] Criar fluxo completo de onboarding: cliente → plano → assinatura → evento → consulta de uso.
- [ ] Criar fluxo de mudança comercial: assinatura ativa → alteração de plano → novos eventos → impacto esperado.
- [ ] Definir exemplos que usam IDs externos consistentes de ponta a ponta para permitir rastreio visual.

**Evidência de aceite:** cada exemplo de uso tem um cliente e uma assinatura identificáveis, e o efeito de mudança de plano fica explícito.

## Onda 5 — Faturas, pagamentos, créditos e reconciliação

Esta é a segunda metade da cadeia causal: o valor calculado torna-se documento financeiro e recebe liquidação, crédito ou exceção.

- [ ] Documentar listagem, consulta, preparação, finalização e emissão de faturas.
- [ ] Documentar linhas de fatura, valores, impostos, moeda, datas, estados e links de pagamento.
- [ ] Documentar geração e consumo de URLs de pagamento, solicitações de pagamento e registro de pagamentos.
- [ ] Documentar estados de pagamento, falhas, conciliação e tratamento de pagamentos duplicados ou atrasados.
- [ ] Documentar wallets, créditos pré-pagos, transações de saldo, alocação e consumo de crédito.
- [ ] Documentar notas de crédito, anulação, vínculos com faturas e implicações de auditoria.
- [ ] Documentar impostos, regras aplicáveis e dados necessários ao cálculo quando presentes no contrato.
- [ ] Descrever tratamento de exceções financeiras: correção de uso, estorno, crédito, cancelamento e reemissão.
- [ ] Criar fluxo de reconciliação: evento → métrica → charge → linha de fatura → pagamento ou crédito.
- [ ] Adicionar visualização de evidência por etapa na interface, com referências de objeto e operação.

**Evidência de aceite:** um leitor consegue acompanhar uma cobrança desde o evento até a fatura e explicar como tratar pagamento, crédito e discrepância.

## Onda 6 — Webhooks, integrações e segurança operacional

Os fluxos assíncronos e a operação integrada exigem documentação específica para entrega confiável, verificação e resposta a falhas.

- [ ] Inventariar eventos de webhook expostos pela versão da API e classificá-los por domínio.
- [ ] Documentar registro de endpoint, autenticação, assinatura, verificação e rotação de segredo.
- [ ] Criar exemplos de consumidor de webhook em Python e Node.js com validação, idempotência e fila de processamento.
- [ ] Documentar tentativas de entrega, timeout, falha permanente, reprocessamento e observabilidade de webhooks.
- [ ] Mapear integrações de pagamentos, contabilidade, CRM e data warehouse que dependem de objetos do Lago.
- [ ] Criar checklist de segurança: gestão de chaves, segregação de ambientes, mascaramento de dados e minimização de dados pessoais.
- [ ] Incluir orientação para logs: campos permitidos, IDs de correlação, retenção e exclusão de segredos.
- [ ] Documentar procedimento de incidente para faturamento incorreto, indisponibilidade de ingestão e inconsistência de pagamento.

**Evidência de aceite:** um integrador consegue receber eventos assíncronos de forma segura e diagnosticar uma falha sem expor segredo ou duplicar efeitos.

## Onda 7 — SDKs, exemplos executáveis e experiência de desenvolvimento

Os artefatos gerados a partir do OpenAPI devem evoluir de referência inicial para ponto de partida confiável de implementação.

- [ ] Regerar clientes Python e Node.js a partir da versão OpenAPI versionada e registrar o comando, gerador e checksum usados.
- [ ] Tipar requisições e respostas importantes; impedir que exemplos dependam de `any` ou estruturas não verificadas.
- [ ] Criar configuração de ambiente por variáveis: URL regional, chave de API, cliente e assinatura de exemplo.
- [ ] Criar exemplos executáveis para os fluxos de onboarding, lote de eventos, pricing, fatura, pagamento e webhook.
- [ ] Adicionar tratamento de erro por classe, backoff para falhas transitórias e mensagens de diagnóstico contextual.
- [ ] Adicionar paginação e filtros nos exemplos de recursos listáveis.
- [ ] Criar testes automatizados contra respostas de contrato ou mock estritamente derivado do OpenAPI.
- [ ] Publicar guia de atualização de SDK quando a API evoluir, incluindo compatibilidade e breaking changes.

**Evidência de aceite:** um novo integrador executa um fluxo documentado em Python ou Node.js somente com variáveis de ambiente e dados de teste próprios.

## Onda 8 — Interface documental, navegação e conteúdo editorial

O Atlas deve permanecer uma ferramenta de investigação e não apenas uma página de apresentação.

- [ ] Criar rotas profundas por domínio: fundamentos, eventos, métricas, planos, assinaturas, faturas, pagamentos, wallets, crédito, webhooks e analytics.
- [ ] Preservar links compartilháveis para filtros e operações específicas do explorador OpenAPI.
- [ ] Relacionar cada operação a: guia funcional, payload, resposta, código SDK, erro frequente e raw de origem.
- [ ] Adicionar busca por caminho, nome de recurso, campo de payload e termo de negócio em português e inglês técnico.
- [ ] Adicionar índice de conceitos, glossário e mapa de objetos para reduzir ambiguidade de termos.
- [ ] Adicionar navegação de anterior/próximo baseada na cadeia causal de cobrança.
- [ ] Validar acessibilidade: estrutura semântica, foco por teclado, contraste, labels, leitores de tela e redução de movimento.
- [ ] Validar telas mobile, tablet e desktop sem quebrar tabelas, JSON, filtros ou rotas.
- [ ] Medir peso do bundle, dividir carregamento de domínios extensos e manter a navegação inicial rápida.
- [ ] Criar mecanismo de feedback por página que registre lacuna, correção e evidência solicitada.

**Evidência de aceite:** uma pessoa encontra uma operação, entende seu papel no fluxo e alcança o exemplo e a fonte em no máximo três interações.

## Onda 9 — Qualidade, CI/CD e observabilidade da documentação

O pipeline deve validar não só compilação, mas também a confiabilidade do conteúdo e da publicação.

- [ ] Manter `pnpm install --frozen-lockfile`, `pnpm check`, build e smoke test como gates obrigatórios.
- [ ] Adicionar lint de Markdown, checagem de links internos e externos, e validação de headings e âncoras.
- [ ] Adicionar validação da matriz de cobertura para impedir operações OpenAPI sem classificação ou fonte.
- [ ] Adicionar diff automatizado de OpenAPI com alerta quando operações ou schemas mudarem.
- [ ] Adicionar auditoria de dependências e política de atualização para dependências críticas.
- [ ] Adicionar testes end-to-end para navegação, filtro OpenAPI, simulador, troca de modelo e cópia de payload.
- [ ] Publicar relatórios do workflow como artefatos: cobertura, links, build, acessibilidade e tamanho de bundle.
- [ ] Configurar aprovação de revisão técnica para mudanças em exemplos financeiros ou regras de cálculo.
- [ ] Criar job agendado para monitorar mudanças upstream e abrir issue de documentação quando necessário.

**Evidência de aceite:** uma mudança incompatível de contrato, um link quebrado ou uma lacuna de matriz falha no CI antes do merge.

## Onda 10 — Conhecimento reutilizável, apresentação e adoção

Os materiais de comunicação e o processo precisam acompanhar a documentação operacional para que a implementação seja repetível.

- [ ] Manter a skill `lago-billing-docs` alinhada ao fluxo real: extração → proveniência → SDK → interface → fork → CI/CD → localização.
- [ ] Criar checklist de uso da skill para novas versões do OpenAPI e novos projetos de billing.
- [ ] Atualizar o roteiro de apresentação com cada domínio recém-coberto, mantendo até 12 slides quando aplicável.
- [ ] Incluir uma demonstração de ponta a ponta: emitir evento, observar métrica, simular cobrança, consultar fatura e reconciliar pagamento.
- [ ] Criar guia de contribuição para consumidores internos: como corrigir conteúdo, enviar exemplo e anexar evidência.
- [ ] Criar plano de treinamento para engenharia, produto, suporte e operações financeiras, cada um com caminhos de leitura específicos.
- [ ] Medir adoção: páginas mais consultadas, buscas sem resultado, feedbacks e pontos de abandono.

**Evidência de aceite:** a atualização da documentação pode ser repetida por outra pessoa com a skill, checklist, CI e roteiro existentes.

## Sequência recomendada e dependências

| Ordem | Frente | Depende de | Resultado que desbloqueia |
|---:|---|---|---|
| 1 | Onda 0 | Acesso administrativo ao fork | URL pública e governança de mudança |
| 2 | Onda 1 | Bundle OpenAPI e raws | Fundamentos consistentes para todos os exemplos |
| 3 | Onda 2 | Fundamentos e entidades de exemplo | Evento e métrica verificáveis |
| 4 | Onda 3 | Métricas documentadas | Regra comercial e cálculo explicável |
| 5 | Onda 4 | Planos e charges | Assinatura operacional de ponta a ponta |
| 6 | Onda 5 | Eventos, cobrança e assinatura | Fatura, pagamento e reconciliação completos |
| 7 | Onda 6 | Objetos e estados financeiros | Integrações seguras e operação assíncrona |
| 8 | Onda 7 | Fluxos estáveis por domínio | SDKs e exemplos executáveis |
| 9 | Onda 8 | Matriz de cobertura e conteúdo | Experiência documental navegável |
| 10 | Onda 9 | Interface e matrizes consolidadas | Garantias contínuas de qualidade |
| 11 | Onda 10 | Fluxo 360º validado | Adoção, treinamento e repetibilidade |

## Checklist de encerramento

- [ ] A matriz de cobertura não contém operação sem fonte, guia, exemplo e teste aplicável.
- [ ] Todos os exemplos técnicos identificam hipóteses, IDs, região, versão e comportamento de erro.
- [ ] O fluxo completo evento → métrica → cobrança → valor → fatura → pagamento possui uma demonstração reproduzível.
- [ ] O GitHub Pages publica o artefato validado e a URL funciona em navegador sem dependência do sandbox.
- [ ] A interface pt-BR permanece acessível, responsiva e alinhada ao contrato visual Atlas de Operação.
- [ ] Os raws, checksums, SDKs, roteiro de slides e skill foram revisados contra a versão OpenAPI em uso.

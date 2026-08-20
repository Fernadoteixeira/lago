# Backlog de execução

- [x] Preservar o HTML fornecido da landing page oficial do Lago como raw de referência.
- [x] Preservar o HTML fornecido da documentação oficial do Lago como raw de referência.
- [x] Renderizar screenshots dos dois HTMLs e registrar metadados, origem e checksums.
- [x] Verificar o remoto GitHub e o estado da branch main.
- [x] Criar o commit da versão final da documentação Lago 360º.
- [x] Enviar o commit validado para a branch main.
- [x] Confirmar o estado do fork Fernadoteixeira/lago e o diretório de integração.
- [x] Criar ou sincronizar o fork do repositório getlago/lago.
- [x] Integrar os materiais Lago 360º sem sobrescrever o código existente.
- [x] Criar e enviar o commit final para a branch main do fork.
- [x] Clonar o fork Fernadoteixeira/lago em um diretório isolado do sandbox.
- [x] Materializar a documentação Lago 360º em extra/lago-360-docs no clone local.
- [x] Validar o inventário e o status Git da integração local.
- [x] Instalar dependências e executar a checagem de tipos e o build da interface integrada.
- [x] Gerar o roteiro de apresentação da estrutura de documentação integrada.
- [x] Criar o commit e enviar as alterações validadas para main do fork.
- [x] Executar a interface integrada localmente e verificar sua disponibilidade no sandbox.
- [x] Configurar CI de validação e CD de deploy da documentação integrada.
- [x] Gerar o roteiro completo de apresentação baseado em extra/lago-360-docs.
- [x] Criar e validar uma skill reutilizável para esse fluxo de documentação integrada.
- [x] Publicar as novas automações e os roteiros na branch main do fork.
- [x] Inventariar textos visíveis, atributos de acessibilidade e metadados a localizar.
- [x] Traduzir a interface para pt-BR sem alterar contratos, paths ou identificadores técnicos.
- [x] Validar o build e a renderização da interface localizada.

## Cobertura 360º — continuidade end-to-end

### Iteração de engenharia prioritária

- [x] Gerar a matriz de cobertura a partir do bundle OpenAPI e expor seus indicadores na interface.
- [x] Implementar páginas profundas para fundamentos, eventos, métricas, planos, assinaturas e faturas com rotas compartilháveis.
- [x] Criar exemplos verificáveis de fluxo ponta a ponta em Python e Node.js usando os contratos já extraídos para os cortes comercial e de batch events.
- [ ] Adicionar testes de interface para simulador, filtros OpenAPI, busca, navegação e cópia de payload.
- [ ] Adicionar gates de CI para links, Markdown, matriz de cobertura e regressão de bundle.

### Corte canônico comercial — próximo impacto

- [x] Extrair operações e schemas canônicos de métricas faturáveis, planos, charges e assinaturas do bundle OpenAPI 1.51.0.
- [x] Substituir os guias genéricos de métricas, planos e assinaturas por dossiês com contrato, pré-condições, transições e exceções.
- [x] Adicionar um exemplo ponta a ponta que crie métrica, plano com charge, cliente, assinatura e evento de uso idempotente.
- [x] Validar localmente os payloads de exemplo contra os schemas OpenAPI preservados e testar a composição comercial sem chamadas destrutivas.
- [x] Publicar o corte canônico com testes, build, smoke test e rastreabilidade no fork.

### Corte canônico de ingestão — batch events

- [x] Validar envelope de 1 a 100 eventos, identidade estável e propriedades numéricas em Node.js e Python.
- [x] Reconciliar erros por `transaction_id`, separar aceites e rejeições e gerar retry seletivo sem reenviar itens aceitos.
- [x] Rejeitar IDs duplicados e IDs de erro que não pertencem ao lote original.
- [x] Adicionar o gate `test:batch-contract` ao CI antes do build e documentar a execução reproduzível.

### Migração para UI oficial do Lago

- [x] Inventariar os padrões visuais, a navegação, os tokens e os componentes observáveis nas capturas oficiais preservadas.
- [x] Atualizar o contrato visual para substituir o Atlas de Operação por uma composição fiel à UI oficial, sem remover conteúdo 360º.
- [x] Reestruturar cabeçalho, navegação, hero, índices e superfícies da página principal segundo a referência oficial.
- [x] Aplicar o mesmo sistema visual às rotas de matriz e dossiês, preservando URLs, estados e evidências comerciais.
- [x] Validar fidelidade em desktop e mobile, executar os gates técnicos e publicar a migração visual no fork.

### Descoberta e interação da documentação

- [x] Inventariar rotas, domínios, métodos e estados pesquisáveis para um índice de navegação canônico.
- [x] Implementar busca por rota com resultados agrupados, atalho de teclado e navegação direta para o dossiê ou seção encontrada.
- [x] Adicionar filtros combináveis por domínio, método HTTP, estágio do fluxo e estado de cobertura.
- [x] Incluir carregamento percebido e transições acessíveis entre as rotas da documentação.
- [x] Evoluir os cardblocks da home com detalhes de interação e animações Framer Motion compatíveis com a UI oficial.
- [ ] Validar desktop, mobile, teclado, redução de movimento, testes e publicação no fork.

- [ ] Habilitar GitHub Pages no fork e selecionar GitHub Actions como fonte de publicação.
- [ ] Reexecutar o workflow `Lago 360 Docs` e validar a URL pública, o subcaminho `/lago/` e os ativos de referência.
- [ ] Criar uma matriz rastreável OpenAPI → domínio funcional → tela → exemplo SDK → fonte bruta para identificar lacunas de cobertura.
- [ ] Documentar autenticação, regiões, versionamento, idempotência, paginação, erros e limites da API antes dos guias por domínio.
- [ ] Cobrir clientes, métricas faturáveis, planos, charges, assinaturas, eventos unitários e eventos em lote com contratos e exemplos verificáveis.
- [ ] Cobrir faturas, pagamentos, solicitações de pagamento, wallets, transações de saldo, notas de crédito, impostos e analytics com seus fluxos de exceção.
- [ ] Documentar webhooks, reconciliação, tentativas de reprocessamento, observabilidade e auditoria de uma cadeia de cobrança ponta a ponta.
- [ ] Expandir os SDKs Python e Node.js gerados com exemplos executáveis, tratamento de erros, paginação e testes de contrato.
- [ ] Evoluir o explorador OpenAPI para páginas profundas por domínio, URLs compartilháveis e referências cruzadas para exemplos e fontes.
- [ ] Executar revisão de acessibilidade, responsividade, desempenho e internacionalização pt-BR da experiência documental.
- [ ] Automatizar verificações de qualidade adicionais: links quebrados, lint de Markdown, cobertura da matriz e varredura de dependências.
- [ ] Manter os raws, checksums, inventário de proveniência e versão OpenAPI sincronizados com atualizações upstream.
- [ ] Adicionar testes end-to-end para o simulador de pricing, filtros OpenAPI, cópia de payload e navegação da documentação.
- [ ] Atualizar o roteiro de slides, a skill reutilizável e o guia de CI/CD sempre que houver mudança relevante de contrato ou arquitetura.

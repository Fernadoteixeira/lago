# Contrato visual — UI oficial do Lago

## Aplicação obrigatória

Esta migração toma as capturas oficiais preservadas como especificação visual observável. A arquitetura, os dados, as rotas e a proveniência do **Lago 360º** permanecem próprios; a superfície de interface deve reproduzir o caráter da documentação e da landing oficial do Lago, sem reutilizar código ou ativos proprietários.

## Fundamentos visuais

| Dimensão | Diretriz |
|---|---|
| Navegação | Cabeçalho horizontal em uma ou duas faixas, marca à esquerda, busca/ações à direita e seções de docs como navegação contextual. |
| Fundo | Home em marfim claro com hero suave em gradiente azul/rosa de baixo contraste; páginas de guia em grafite profundo. |
| Cores | Azul Lago para ações primárias, preto/grafite para texto e superfícies de docs, branco e cinza frio para leitura. Sem lima de sinal, papel mineral ou terracota. |
| Tipografia | Sans neutra e legível, títulos grandes com peso 600–700, corpo em cinza moderado; monoespaçada limitada a código, paths e payloads. |
| Componentes | Cards de borda sutil, raio moderado, sombras discretas e ícones lineares. Botões compactos de ação em azul. |
| Código | Blocos escuros de alta legibilidade, bordas azul-ardósia e labels HTTP claros. |

## Mapa de experiência

1. **Home:** ponto de entrada claro, centrado, com busca e grupos de acesso aos domínios 360º.
2. **Batch events:** contrato, fluxo, falhas, retry e payload copiável no padrão de documentação oficial.
3. **Modelos de cobrança:** simulador preservado em superfícies brancas/claras e ações azuis.
4. **Explorador OpenAPI:** filtros e operações em layout de docs com hierarquia limpa.
5. **Matriz e guias:** índice 360º e dossiês profundos em um sistema de navegação de documentação escuro.

## Interação e acessibilidade

- Toda função interativa deve ser alcançável por teclado e ter foco visível em azul Lago.
- Animações usam somente `transform` e `opacity`, duram até 240 ms e respeitam `prefers-reduced-motion`.
- Componentes de simulação continuam explicitamente didáticos; não induzem previsões financeiras.
- A transição de fundo claro para escuro deve preservar contraste em todos os textos, links e campos de busca.

## Implementação

- A marca, a busca, o CTA azul e os cards de entrada devem ser visíveis sem rolagem excessiva em desktop.
- A navegação horizontal deve recolher com segurança em telas menores, sem perder as rotas 360º.
- O explorador OpenAPI, os exemplos e os dossiês comerciais preservam seus contratos 1.51.0 e a evidência de fonte.
- Consulte `OFFICIAL_UI_REFERENCE.md` antes de editar arquivos de interface; fidelidade à referência prevalece sobre decisões visuais anteriores.

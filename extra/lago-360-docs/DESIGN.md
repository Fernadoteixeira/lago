# DESIGN.md — Lago 360º Billing Docs

## Aplicação obrigatória

Esta página usa a direção **Atlas de Operação** definida em `ideas.md`. Não introduzir gradientes roxos, layouts genéricos centralizados, cantos excessivamente arredondados ou a família tipográfica Inter.

## Fundamentos visuais

| Dimensão | Diretriz |
|---|---|
| Fundo | Papel mineral claro, com textura sutil e baixo contraste. |
| Estrutura | Navegação lateral fixa, área de leitura assimétrica e blocos de dados com ritmo editorial. |
| Cores | Azul-petróleo para estrutura, lima de sinal para rotas e estados válidos, terracota para risco. |
| Tipografia | Space Grotesk para hierarquia, Source Sans 3 para texto e IBM Plex Mono para dados técnicos. |
| Código | Fundo azul-petróleo profundo, contraste alto e labels de método HTTP. |
| Motivos | Trilhas pontilhadas, tags de dossier e réguas de pricing. |

## Mapa de experiência

1. **Visão geral:** uma síntese operacional de eventos para faturas.
2. **Batch events:** formato, regras, retorno assíncrono, falhas e payload copiável.
3. **Modelos de cobrança:** comparador interativo entre graduated e volume.
4. **Explorador OpenAPI:** filtros por domínio, pesquisa por path e inspeção de operações.
5. **Proveniência:** versão, sources e links para os raws preservados.

## Interação e acessibilidade

- Toda função interativa deve ser alcançável por teclado e apresentar estado de foco nítido.
- Animações usam somente `transform` e `opacity`, duram até 240 ms e respeitam `prefers-reduced-motion`.
- Componentes de simulação não podem induzir valores financeiros como previsões; devem ser explicitamente didáticos.
- Conteúdo técnico deve mostrar unidades, moeda e a regra de cálculo correspondente.

## Implementação de componentes

- O painel de navegação deve permanecer visível em telas largas e virar menu horizontal de seções em telas menores.
- O explorador OpenAPI deve expor os domínios centrais: eventos, métricas, planos, assinaturas, faturas, pagamentos, wallets, crédito e analytics.
- Os exemplos de payload usam o contrato da API 1.51.0 e indicam campos obrigatórios por meio de comentários ou tags.
- O painel de comparativo precisa mostrar que **graduated** cobra incrementos por faixa e **volume** aplica uma única tarifa por unidade à faixa total alcançada.

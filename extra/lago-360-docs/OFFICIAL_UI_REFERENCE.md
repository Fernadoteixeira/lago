# Referência visual oficial do Lago

## Escopo de fidelidade

As capturas preservadas em `/home/ubuntu/webdev-static-assets/lago-landing-reference.png` e `/home/ubuntu/webdev-static-assets/lago-docs-reference.png` são a fonte visual para esta migração. A arquitetura documental 360º permanece própria; a composição, os tokens e a linguagem de interface devem aproximar-se das referências oficiais sem reutilizar código proprietário.

## Padrões observáveis

| Área | Documentação oficial escura | Landing oficial clara | Aplicação na documentação 360º |
|---|---|---|---|
| Navegação | Duas faixas horizontais: marca e ações no topo; seções abaixo. | Barra única, branca, com navegação por produto e CTA azul. | Cabeçalho horizontal responsivo, marca Lago, busca e CTA azul. |
| Superfície | `#151923` aproximado; textos brancos e cinza frio; bordas azul-ardósia. | Fundo marfim e hero em gradiente azul/rosa discreto. | Página inicial clara com hero suave; guias técnicos escuros, como a referência de docs. |
| Tipografia | Sans geométrica/neutra, títulos grandes, peso 600–700. | Título central grande em preto; corpo cinza escuro. | Escala simples de leitura, sem tipografia editorial/monoespaçada dominante. |
| Componentes | Cards escuros contornados, raio médio e ícone linear. | Botões compactos azuis e superfícies brancas com bordas cinza claras. | Cards 360º e blocos de evidência devem usar borda sutil, raio 10–14px e azul Lago como ação. |
| Densidade | Hero centralizado com bastante respiro; grade 3×2 de pontos de entrada. | Hero centralizado e painéis financeiros sobrepostos. | Conteúdo 360º organizado em índice centralizado e grupos de acesso por domínio; dados preservados sem densidade Atlas. |

## Decisões obrigatórias

1. Remover papel mineral, lima de sinal, sidebar permanente e estética editorial do Atlas de Operação.
2. Adotar azul Lago para ações primárias, superfícies neutras, bordas discretas e sombras muito suaves.
3. Manter o conteúdo em pt-BR, rotas atuais, OpenAPI, referências, exemplos e estados de cobertura.
4. Priorizar duas experiências coerentes: **home/índice claro** com hero de produto e **guias escuros** inspirados no centro de documentação oficial.
5. Preservar acessibilidade: contraste, foco visível, navegação por teclado e redução de movimento.

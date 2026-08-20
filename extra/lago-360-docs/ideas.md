# Direção visual — Lago 360º Billing Docs

## Três abordagens exploradas

| Tema | Introdução breve | Probabilidade |
|---|---|---:|
| **Atlas de Operação** | Um atlas editorial de sistemas: painéis de documentação, trilhas de eventos e diagramas de decisão em uma composição assimétrica, analítica e calma. A estética faz a complexidade operacional parecer navegável. | 0.04 |
| **Razão Mineral** | Uma interpretação de livro-caixa técnico, com papel quente, marcas de auditoria e blocos tabulares. A linguagem visual ressalta que billing é uma disciplina de precisão e governança. | 0.07 |
| **Sinal de Rede** | Uma sala de controle noturna, com rotas de eventos em luz e estados de processamento destacados. A abordagem privilegia monitoramento e sensação de fluxo em tempo real. | 0.02 |

## Abordagem selecionada: Atlas de Operação

### Movimento de design

Editorial suíço aplicado à documentação de sistemas: tipografia rigorosa, assimetria funcional, módulos de leitura e diagramas de processo com precisão de instrumento.

### Princípios centrais

1. **A complexidade deve ficar legível:** cada área responde a uma pergunta operacional específica.
2. **O fluxo é o protagonista:** eventos, métricas, planos, fees e faturas são exibidos como uma sequência causal.
3. **Densidade controlada:** tabelas e código têm prioridade, mas recebem hierarquia, respiro e filtros.
4. **Transparência de fonte:** toda informação factual mantém contexto de OpenAPI, versão e proveniência.

### Filosofia de cor

O fundo em papel mineral reduz fadiga de leitura e remete a um dossiê técnico. O azul-petróleo oferece estabilidade para infraestrutura; o verde-lima é reservado a sinais de execução, dados válidos e caminhos ativos. O terracota aparece somente para alertas, exceções e risco de faturamento.

### Paradigma de layout

Uma barra de navegação vertical fixa organiza o mapa da documentação. À direita, uma coluna de conteúdo alterna entre um grande painel de fluxo, um canvas de OpenAPI e cartões de modelo de cobrança, sem reproduzir uma grade centralizada convencional.

### Elementos de assinatura

1. **Trilhas pontilhadas de evento** conectam etapas de ingestão, medição e fatura.
2. **Etiquetas de dossier** identificam domínio, versão e estado em pequenos blocos monocromáticos.
3. **Réguas de faixa** com marcadores progressivos representam pricing graduado e por volume.

### Filosofia de interação

Toda interação deve responder à investigação: filtrar endpoints, alternar entre modelos, revelar a lógica de cálculo e copiar um payload. O usuário nunca encontra uma ação decorativa sem consequência de leitura.

### Animação

Entradas discretas por opacidade e deslocamento vertical de 8 px, em até 240 ms; as trilhas de eventos percorrem um traço curto apenas quando o usuário troca o modelo ou inicia a simulação. Estados de hover são rápidos, táteis e contrastados. A preferência por movimento reduzido elimina transições não essenciais.

### Sistema tipográfico

**Space Grotesk** organiza títulos, métricas e chamadas estruturais; **Source Sans 3** sustenta a leitura longa; **IBM Plex Mono** é usada exclusivamente para paths, JSON, IDs e respostas técnicas. Títulos em caixa baixa controlada, sem excesso de letras maiúsculas.

### Essência da marca

**Uma lente operacional para equipes que precisam entender, implementar e auditar o billing por uso do Lago sem perder o contexto do fluxo.** Personalidade: precisa, instrumental e serena.

### Voz da marca

Direta, técnica e instrutiva; CTAs descrevem a próxima operação real, em vez de usar slogans genéricos.

> “Trace o evento até a linha de fatura.”

> “Compare o preço incremental com o preço de faixa alcançada.”

### Wordmark e logo

O símbolo é um núcleo circular dividido por três trilhas de telemetria, sugerindo evento, métrica e fatura convergindo. O logotipo usa Space Grotesk com espaçamento compacto e não depende de uma fonte padrão isolada.

### Cor de assinatura

**Lima de sinal — `#C4F16A`**. É usada como indicador de rota ativa, status válido e elemento de reconhecimento da experiência.

## Decisões de estilo

O `DESIGN.md` não existia nos arquivos compartilhados nem no checkout local consultado. Foi criado neste projeto como contrato de implementação, a partir da abordagem selecionada acima, e será aplicado integralmente.

- **Lima de sinal:** usar `#C4F16A` em rota ativa, estado válido, marcador de fluxo, seleção e numeral crítico; nunca como preenchimento dominante de superfícies extensas.
- **Fluxo causal:** explicitar em cada seção a ligação entre evento, métrica, cobrança, valor e fatura por marcadores sequenciais e trilhas pontilhadas.
- **Assimetria contínua:** manter tensão editorial entre painéis, tabelas e blocos de leitura; evitar que seções intermediárias virem uma landing page centralizada convencional.

## Migração aprovada: fidelidade às UIs oficiais do Lago

As decisões anteriores de **Atlas de Operação** permanecem registradas somente como histórico. A referência oficial capturada é a especificação de fidelidade para a próxima versão; consultar `OFFICIAL_UI_REFERENCE.md` e `DESIGN.md` antes de editar qualquer página ou estilo.

### Direção selecionada

**Lago Documentation & Product UI.** A experiência combina a home clara de produto, com hero amplo e ação azul, ao centro de documentação grafite com navegação horizontal, busca e cards técnicos. A cobertura 360º é preservada como conteúdo e estrutura, não como uma linguagem visual paralela.

### Regras de implementação

1. Navegação horizontal e marca Lago substituem a barra lateral fixa.
2. Azul Lago é a cor de interação primária; superfícies são claras ou grafite, com bordas discretas.
3. Cards de domínio, exemplos e grupos de navegação seguem a escala, a densidade e o raio moderado observados nas capturas.
4. Headlines e CTAs mantêm voz técnica em pt-BR, mas seguem a hierarquia simples e centralizada das referências.

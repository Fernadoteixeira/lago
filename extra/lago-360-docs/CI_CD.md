# CI/CD da documentação Lago 360º

## Objetivo

O workflow `.github/workflows/lago-360-docs.yml` valida e publica a documentação estática hospedada em `extra/lago-360-docs/`. O fluxo preserva o código principal do Lago e só executa quando o diretório da documentação ou o próprio workflow é alterado.

## Etapas automatizadas

| Etapa | Comando ou ação | Finalidade |
|---|---|---|
| Instalação | `pnpm install --frozen-lockfile` | Reproduz a árvore de dependências fixada no lockfile. |
| Tipagem | `pnpm check` | Executa `tsc --noEmit` antes do build. |
| Build | `VITE_BASE_PATH=/lago/ pnpm build` | Gera artefatos estáticos corretos para o subcaminho do repositório no GitHub Pages. |
| Artefato | `actions/upload-pages-artifact@v3` | Transfere somente `dist/public` para o ambiente de Pages. |
| Deploy | `actions/deploy-pages@v4` | Publica a versão validada no ambiente `github-pages`. |

## Gatilhos e destino

O pipeline valida pull requests que alterem a documentação. Em commits para `main` e em execuções manuais, ele também publica a versão estática no GitHub Pages. O destino esperado é `https://fernandoteixeira.github.io/lago/`; o Vite recebe `VITE_BASE_PATH=/lago/` para resolver corretamente os ativos estáticos nesse subcaminho.

> **Pré-requisito de primeira publicação.** No repositório do fork, configure **Settings → Pages → Build and deployment → Source: GitHub Actions**. Depois do primeiro push para `main`, o job `deploy` fará a publicação. Essa ativação depende de uma sessão do GitHub com permissão administrativa para Pages.

## Ativos de referência

As imagens de referência usadas pela interface ficam em `client/public/reference-images/`. Ao usar `import.meta.env.BASE_URL`, a aplicação funciona tanto em desenvolvimento local (`/`) quanto no subcaminho de GitHub Pages (`/lago/`).

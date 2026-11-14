# Como contribuir com a GANJA STUDIO

Este repositório publica o site [ganja.inspira.dev.br](https://ganja.inspira.dev.br) pelo GitHub Pages a cada push em `main`. Toda mudança chega a `main` por pull request revisado.

Antes de mexer em decisões comerciais ou de integração, leia [`specs/001-definicoes-ganja/spec.md`](specs/001-definicoes-ganja/spec.md), o `plan.md` da mesma pasta e as decisões em [`decisions/`](decisions/).

## Fluxo

1. Abra ou escolha uma issue. Use os modelos em **New issue**; eles seguem o formato das issues existentes.
2. Crie uma branch a partir de `main` (por exemplo `feat/feed-paginacao` ou `fix/drawer-foco`).
3. Faça commits no padrão abaixo.
4. Rode as verificações locais:

   ```bash
   npm ci
   npm run test:unit
   npm run build
   npx playwright test   # quando a mudança toca interface
   ```

5. Abra o PR preenchendo o modelo. Use `Closes #N` só quando o PR cumpre todos os critérios de aceite da issue; caso contrário, use `Refs #N`.
6. O PR entra em `main` depois da revisão. O workflow `Deploy GitHub Pages` publica o site.

## Commits: Conventional Commits em português

Formato:

```text
<tipo>(<escopo>): <descrição no imperativo, em português, sem ponto final>

<corpo opcional: o que muda e por quê>

<rodapé opcional: Refs #N, Closes #N, BREAKING CHANGE: ...>
```

O tipo fica em inglês, porque o release-please depende dele. Escopo, descrição e corpo ficam em português.

| Tipo | Quando usar | Entra no CHANGELOG |
| --- | --- | --- |
| `feat` | Nova funcionalidade visível para quem visita o site | Sim, em **Novidades** (versão minor) |
| `fix` | Correção de comportamento | Sim, em **Correções** (versão patch) |
| `perf` | Ganho de desempenho | Sim, em **Desempenho** |
| `revert` | Reversão de um commit anterior | Sim, em **Reversões** |
| `docs` | Documentação, decisões e especificações | Sim, em **Documentação** |
| `style` | Formatação sem mudança de comportamento | Não |
| `refactor` | Reestruturação sem mudança de comportamento | Não |
| `test` | Testes unitários ou Playwright | Não |
| `build` | Vite, TypeScript, dependências | Não |
| `ci` | Workflows do GitHub Actions | Não |
| `chore` | Manutenção geral | Não |

Mudança incompatível: use `!` depois do tipo (`feat(feed)!: ...`) ou o rodapé `BREAKING CHANGE: ...`. Isso gera uma versão major.

### Escopos

Use o escopo da área afetada. Se nenhum servir, omita o escopo.

| Escopo | Área |
| --- | --- |
| `hero` | Seção 00, stickers arrastáveis (`HeroSection`, `DraggableSticker`) |
| `cabecalho` | Menu indexado colado (`StickyHeader`) |
| `manifesto` | Seção de origem e manifesto (`OriginManifestoSection`) |
| `frentes` | Arquitetura dupla das frentes (`DualArchitectureSection`) |
| `stage-proof` | Seção Stage Proof (`StageProofSection`) |
| `lookbook` | Mostruário, cards e zoom macro (`LookbookSection`, `LookCard`) |
| `looks` | Drawer técnico, CTAs e catálogo (`LookTechnicalDrawer`, `src/data/collection.ts`) |
| `moodboard` | Mesa de Luz (`ArenaMoodboard`) |
| `letreiro` | Letreiro cinético (`KineticMarquee`) |
| `rodape` | Rodapé, contato e selo +INSPIRA (`CreatorContactFooter`) |
| `feed` | Feed Instagram e página `#/feed` |
| `cursor` | Cursor personalizado (`CustomCursor`) |
| `a11y` | Acessibilidade transversal (leitores de tela, contraste, teclado) |
| `toque` | Interações por toque e ponteiro impreciso |
| `deploy` | GitHub Pages, base do Vite, domínio |
| `release` | Versionamento e CHANGELOG |
| `testes` | Infraestrutura de testes |

### Exemplos

```text
feat(feed): paginar publicações na página #/feed
fix(hero): liberar rolagem vertical ao tocar nos stickers
fix(a11y): ler o menu indexado como nomes completos
perf(lookbook): pré-carregar as pranchas macro
docs: registrar decisão sobre a consulta dos looks
ci(release): configurar release-please
```

### Título do PR

Quando o PR é integrado com **Squash and merge**, o título do PR vira o commit em `main`. Por isso o título do PR também segue o padrão acima.

## Labels e milestones

As labels vivem em [`.github/labels.yml`](.github/labels.yml) e são sincronizadas pelo workflow `Sync labels` a cada merge que altera esse arquivo. Para criar ou mudar uma label, edite o arquivo no PR. A sincronização nunca apaga labels.

| Label | Uso |
| --- | --- |
| `instagram` | Feed Instagram e integração com a conta da marca |
| `vitrine-dependency` | Depende de entrega em [coletivo-inspira/vitrine](https://github.com/coletivo-inspira/vitrine) |
| `blocked` | Bloqueada por dependência externa ou decisão pendente |
| `release` | Versionamento, changelog e publicação |

Os milestones são mantidos pelo workflow `Sync milestones` (`.github/workflows/milestones.yml`): `v1.1 Experiencia acessivel`, `v1.2 Feed Instagram` e `Piloto Instagram`.

## Versões e releases

As versões seguem [SemVer](https://semver.org/lang/pt-BR/) e são geradas pelo [release-please](https://github.com/googleapis/release-please):

1. A cada push em `main`, o workflow `Release Please` lê os commits desde a última versão e abre ou atualiza um PR `chore: publicar versão X.Y.Z` com o `CHANGELOG.md` e a versão do `package.json`.
2. Ao integrar esse PR, o workflow cria a tag `vX.Y.Z` e a GitHub Release com as notas do changelog.
3. O mesmo push em `main` dispara o `Deploy GitHub Pages`, que publica a versão no site.

A primeira versão é `v1.0.0` e corresponde ao site atual. Não edite `CHANGELOG.md`, `.release-please-manifest.json` nem a versão do `package.json` à mão.

# Piloto Instagram da Ganja

Data: 12/11/2026, atualizado em 14/11/2026. Status: o lado Ganja está implementado e lê o contrato público documentado pelo Vitrine (`schemaVersion: 1`). O roteiro do piloto está em [docs/instagram-pilot-validation.md](instagram-pilot-validation.md). Nenhuma conexão real com o Instagram existe: as issues Vitrine #48–#51 foram fechadas como documentação, e as rotas OAuth, a sincronização e a rota pública ainda não foram implementadas no Vitrine.

## Objetivo e ponto de partida

Exibir o feed autorizado de @ganjastudio.br e permitir que o dono gerencie a conexão no painel Vitrine. A faixa partiu de INSTAGRAM_STRIP_ITEMS em src/data/creator.ts, renderizada em src/components/CreatorContactFooter.tsx. São imagens fixas, não sincronização Instagram, e agora o site diz isso na própria faixa.

## Caminho das pedras

1. Resolver configuração Meta e conexão pelo painel no Vitrine, com consentimento do dono e vínculo à vitrine correta.
2. Aguardar a definição do contrato público e sincronização. Ganja consome só dados públicos do Vitrine, sem tokens nem chamadas autenticadas diretas ao Instagram.
3. Planejar substituição da faixa fixa por publicações reais, preservando tipografia, geometria, tratamento visual e links originais. Mapear fotos, carrosséis e capas de vídeos sem prometer reprodução de formatos ainda não validados.
4. Planejar página pública do feed com paginação e acesso pelo menu. Prever link de gestão para painel.inspira.dev.br, com destino da vitrine validado na implementação; o painel exige login e autorização.
5. Definir carregamento, estado vazio, falha temporária e desconexão. Não apresentar material estático como conteúdo sincronizado.
6. Executar o piloto somente após implementar as dependências e confirmar liberação Meta aplicável.

## Entregue na Ganja (14/11/2026)

Fecha [ganja #4](https://github.com/coletivo-inspira/ganja/issues/4) e [ganja #5](https://github.com/coletivo-inspira/ganja/issues/5) e cobre os módulos Ganja do PRD [ganja #17](https://github.com/coletivo-inspira/ganja/issues/17).

- **Adaptador `src/feed/`.** A interface `FeedSource` tem `getPage(cursor)`, que devolve perfil, publicações e `nextCursor`. `StaticFeedSource` monta as páginas a partir de `INSTAGRAM_STRIP_ITEMS`. `VitrineFeedSource` só é usado quando `VITE_VITRINE_FEED_URL` está definida no build. Ele faz um `GET` sem credenciais (`credentials: 'omit'`), sem cabeçalho `Authorization` e sem token. Mídias só aceitam http(s), e os links originais só aceitam `https://*.instagram.com`; fora disso, o link vai para o perfil.
- **Faixa do rodapé.** A faixa lê pelo adaptador. Com o arquivo estático, o selo diz "ARQUIVO ESTÁTICO — NÃO SINCRONIZADO COM O INSTAGRAM". Com o Vitrine, diz "FEED SINCRONIZADO VIA VITRINE". Se o Vitrine falhar ou a conta estiver desconectada, a faixa volta ao arquivo e diz "FEED INDISPONÍVEL — EXIBINDO ARQUIVO ESTÁTICO, NÃO SINCRONIZADO". O botão "VER FEED COMPLETO" leva a `#/feed`. A página é acessada por esse botão. O índice do cabeçalho continua com as sete células atuais; incluir o feed ali é uma decisão de design ainda em aberto.
- **Página `#/feed`.** A rota por hash dispensa reescrita de URL no GitHub Pages. A página tem paginação por cursor ("Carregar mais", sem duplicar publicações), cartões de foto, carrossel (com número de mídias) e capa de vídeo (sem reprodução automática), e links para a publicação original em nova aba. Os estados são carregando, vazio, falha (com "Tentar novamente"), falha ao carregar mais (as publicações já exibidas ficam) e conta desconectada. O selo de origem acompanha o estado: arquivo estático, consultando, sincronizado, indisponível ou desconectado.
- **Gestão.** "Gerenciar no Vitrine" abre `https://painel.inspira.dev.br/`, que pode ser trocado por `VITE_VITRINE_MANAGE_URL`. O texto ao lado avisa que o painel exige login e autorização do dono e que o link não concede acesso por si só.
- **Teclado e celular.** O foco vai para o título quando a página abre e para a primeira publicação nova depois de "Carregar mais". Todos os links e botões têm contorno visível. Em 390 px a grade tem duas colunas, sem rolagem horizontal. O visual segue o brutalismo do site: raio 0, sem blur, borda de 1 px `#111111`, sombra dura de 4 px, Syne e Space Mono.
- **Testes.** `src/__tests__/feedSource.test.ts` e `src/__tests__/feedPage.test.tsx` (unitários) e `tests/e2e/feed-page.spec.ts` (Playwright). O Playwright roda o site sem a variável e uma segunda instância com `VITE_VITRINE_FEED_URL` apontando para um host simulado na rota documentada. `src/__tests__/vitrineContract.test.tsx` e `src/__tests__/instagramPilotCheck.test.ts` cobrem o contrato `schemaVersion: 1` e o script do piloto. Contagens em `TEST_READY.md`.

### Contrato público do Vitrine (`schemaVersion: 1`)

`VitrineFeedSource` lê o contrato de [`docs/instagram/interface-publica-feed.md`](https://github.com/coletivo-inspira/vitrine/blob/main/docs/instagram/interface-publica-feed.md) (vitrine #51):

```
GET /data/vitrines/:slug/instagram-feed.json?limit=12&cursor=<opaco>      (limit 1–24)
200 { schemaVersion: 1, slug, status: 'active' | 'empty' | 'stale', stale?, revision, hash, syncedAt,
      profile: { username, displayName?, profileUrl, avatarUrl? },
      pageInfo: { limit, hasNextPage, nextCursor: string | null },
      items: [{ id, mediaType: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO', mediaUrl, thumbnailUrl?,
                caption?, permalink, publishedAt, children?: [{ id, mediaType, mediaUrl, thumbnailUrl? }] }] }
404 { error: 'FEED_NOT_FOUND', status: 'disconnected' } → conta desconectada; o dono reconecta no painel.
503 { error: 'FEED_UNAVAILABLE', status: 'unavailable' } → ainda sem projeção; "Tentar novamente".
400 { error: 'INVALID_CURSOR' } → cursor de outra vitrine; os posts já exibidos ficam.
```

Na Ganja:

- `status: "stale"` mantém as publicações e troca o selo para "ÚLTIMA SINCRONIZAÇÃO VÁLIDA — DESATUALIZADO", na página e na faixa.
- Um `slug` diferente do que está na URL configurada é recusado. A faixa volta ao arquivo estático com o selo de indisponível.
- Um `404` sem corpo `FEED_NOT_FOUND` conta como falha, não como desconexão.
- O formato provisório anterior (`status: 'connected'`, `nextCursor` na raiz, `timestamp`, `childrenCount`, `410`) continua sendo lido.

As fixtures do contrato ficam em `tests/fixtures/vitrine-feed-v1/`. O validador compartilhado entre testes e piloto é `scripts/instagram-pilot/vitrine-contract.mjs`.

O endpoint precisa responder com CORS para `https://ganja.inspira.dev.br` e não pode exigir cookie nem token do navegador. A Ganja não consome o webhook `instagram.feed.updated`, porque o GitHub Pages não tem servidor para validar HMAC. O navegador lê a rota principal com o cache HTTP.

## O que espera o Vitrine

As quatro issues abaixo foram fechadas como documentação (#48 em 14/11/2026, #49–#51 em 12/11/2026). Nenhuma issue aberta do Vitrine acompanha a implementação. O que falta:

- [vitrine #48](https://github.com/coletivo-inspira/vitrine/issues/48): no checklist de `docs/instagram/configuracao-meta.md`, os itens 1, 2, 8–11, 13–16 e 18–20 seguem pendentes. Entre eles estão a conta profissional confirmada, o login unificado, a conta de teste, as URLs públicas, as rotas no Worker, o cofre, a verificação da empresa e a revisão do app.
- [vitrine #49](https://github.com/coletivo-inspira/vitrine/issues/49): implementar "Conectar Instagram" no painel e informar o destino exato da vitrine Ganja, que vai para `VITE_VITRINE_MANAGE_URL`.
- [vitrine #50](https://github.com/coletivo-inspira/vitrine/issues/50): implementar a sincronização periódica e fixar a frequência e a política de retenção, remoção e cache.
- [vitrine #51](https://github.com/coletivo-inspira/vitrine/issues/51): implementar a rota pública documentada e publicá-la em produção. Para ligar o feed real na Ganja, basta definir `VITE_VITRINE_FEED_URL` no workflow do Pages.
- [ganja #6](https://github.com/coletivo-inspira/ganja/issues/6) continua aberta. O piloto segue [docs/instagram-pilot-validation.md](instagram-pilot-validation.md) depois que essas dependências existirem.

## Premissas e limites

Uma conta Instagram por vitrine; leitura de perfil/feed; autorização oficial pelo dono; sincronização periódica sem promessa de tempo real. Informar o link do perfil não substitui a autorização. “Todas as fotos” significa todo conteúdo acessível pela API, consultado com paginação. Mensagens ficam fora da primeira entrega. Nenhum segredo deve entrar em documentos, frontend ou logs.

## Tarefas e dependências

- [vitrine #48 — Mapear configuração Meta para integração Instagram](https://github.com/coletivo-inspira/vitrine/issues/48)
- [vitrine #49 — Planejar Conectar Instagram no painel por vitrine](https://github.com/coletivo-inspira/vitrine/issues/49)
- [vitrine #50 — Planejar sincronização periódica do perfil e feed Instagram](https://github.com/coletivo-inspira/vitrine/issues/50)
- [vitrine #51 — Definir interface pública do feed para sites conectados](https://github.com/coletivo-inspira/vitrine/issues/51)
- [vitrine #52 — Mapear mensagens no Instagram como evolução futura](https://github.com/coletivo-inspira/vitrine/issues/52)
- [ganja #4 — Planejar substituição das imagens fixas pelo feed Instagram](https://github.com/coletivo-inspira/ganja/issues/4)
- [ganja #5 — Planejar página do feed e acesso à gestão no Vitrine](https://github.com/coletivo-inspira/ganja/issues/5)
- [ganja #6 — Definir validação do piloto Instagram com Ganja](https://github.com/coletivo-inspira/ganja/issues/6)

Sequência: Meta → conexão no painel → sincronização → interface pública → Ganja → validação. Mensagens são uma trilha futura, sem bloquear o feed.

## Roteiro de aceite futuro

- [ ] Dono conecta, cancela ou recusa autorização sem vínculo incorreto.
- [ ] Importação percorre múltiplas páginas; atualização repetida não duplica posts.
- [ ] Nova publicação aparece no ciclo definido, sem exigir edição manual do site.
- [ ] Fotos, carrosséis e vídeos seguem o contrato público; links abrem a publicação original.
- [ ] Conta vazia, postagem removida, falhas e limites da API têm comportamento definido.
- [ ] Expiração/revogação orienta reconexão; desconexão interrompe sincronização e aplica política de remoção/cache definida no Vitrine.
- [ ] Usuário de outra vitrine não lê credenciais nem altera a integração; navegador e logs não expõem tokens.
- [ ] Página, paginação e acesso à gestão funcionam em celular e por teclado.

Estes cenários dependem do Vitrine real e continuam pendentes. Os testes da Ganja simulam o contrato documentado e não substituem o piloto. O passo a passo, a verificação automática (`scripts/instagram-pilot/check-feed.mjs`) e a tabela de evidências estão em [docs/instagram-pilot-validation.md](instagram-pilot-validation.md). Registrar evidências e bloqueios na issue Ganja #6.

## Pendências e referência

Confirmar conta profissional, responsável Meta, infraestrutura, frequência, histórico/mídias disponíveis e política de retenção nas issues Vitrine #48–#51. O link do perfil sozinho não concede acesso ao feed.

[Roteiro central do Vitrine](https://github.com/coletivo-inspira/vitrine/blob/codex/instagram-integration-roadmap/docs/instagram-integration-roadmap.md).

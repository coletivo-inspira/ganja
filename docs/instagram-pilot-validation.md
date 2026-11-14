# Roteiro de validação do piloto Instagram (ganja #6)

Data: 14/11/2026. Status: roteiro publicado e ferramentas prontas na Ganja. **Nenhum cenário foi executado com a conta real.** O piloto espera o serviço do Vitrine (ver "Bloqueios"). Os testes citados abaixo usam a fixture do contrato documentado e não substituem o piloto.

Referências: [ganja #6](https://github.com/coletivo-inspira/ganja/issues/6), [docs/instagram-integration-roadmap.md](instagram-integration-roadmap.md), contrato público do Vitrine em [`docs/instagram/interface-publica-feed.md`](https://github.com/coletivo-inspira/vitrine/blob/main/docs/instagram/interface-publica-feed.md) e checklist Meta em [`docs/instagram/configuracao-meta.md`](https://github.com/coletivo-inspira/vitrine/blob/main/docs/instagram/configuracao-meta.md).

## Bloqueios antes do piloto

O mapeamento da [vitrine #48](https://github.com/coletivo-inspira/vitrine/issues/48) foi fechado em 14/11/2026 como documento. As ações abaixo continuam pendentes no checklist do Vitrine e impedem o piloto:

| Bloqueio | Item no checklist Vitrine | Responsável |
| --- | --- | --- |
| Confirmar que `@ganjastudio.br` é conta profissional (Empresa ou Criador) e qual portfólio a possui | 1 | Dono da conta Ganja |
| Registrar o responsável nominal pelo app Meta | 2 | Lino |
| Criar a configuração do login unificado só com `instagram_basic`, com URL de redirecionamento e `config_id` | 8, 9 | Lino |
| Revisar permissões extras e pedir só o mínimo | 10 | Lino |
| Convidar a conta de teste (*Instagram Tester*) e gerar token de teste | 11 | Lino + dono da conta Ganja |
| Publicar `/privacidade` e `/termos`, verificar DNS de `inspira.dev.br` e cadastrar as URLs no console | 13 | Lino |
| Implementar `/api/instagram/oauth/callback`, `/deauthorize` e `/data-deletion` no Worker | 14 | Equipe Vitrine |
| Guardar `META_APP_ID`, `META_APP_SECRET` e `META_IG_CONFIG_ID` no cofre do Worker | 15 | Lino + Equipe Vitrine |
| Primeiro `signed_request` em modo desenvolvimento | 16 | Equipe Vitrine + Lino |
| Verificação da empresa, revisão do app e acesso de contas externas | 18, 19, 20 | Lino + Equipe Vitrine |
| Servir `GET /data/vitrines/ganja/instagram-feed.json` em produção, com CORS para `https://ganja.inspira.dev.br` | Contrato #51 (sem implementação) | Equipe Vitrine |

As issues [vitrine #49](https://github.com/coletivo-inspira/vitrine/issues/49), [#50](https://github.com/coletivo-inspira/vitrine/issues/50) e [#51](https://github.com/coletivo-inspira/vitrine/issues/51) foram fechadas como planejamento. O documento do Vitrine diz que as rotas OAuth, a sincronização e a rota pública do feed "ficam como código futuro". Hoje nenhuma issue aberta do Vitrine acompanha essa implementação. A ganja #6 depende dela.

## Verificação automática da leitura pública

`scripts/instagram-pilot/check-feed.mjs` consulta o feed público como o site faz: `GET` sem cookie, sem `Authorization` e sem token. O script recusa uma URL que contenha `token`, `access_token` ou `secret`. O relatório não imprime legendas, URLs de mídia nem valores com formato de token.

```bash
node scripts/instagram-pilot/check-feed.mjs \
  --url https://vitrine.inspira.dev.br/data/vitrines/ganja/instagram-feed.json \
  --other-url https://vitrine.inspira.dev.br/data/vitrines/<outra-vitrine>/instagram-feed.json \
  --save piloto-ciclo-1.json --out piloto-ciclo-1.md

# no próximo ciclo de sincronização
node scripts/instagram-pilot/check-feed.mjs --url <mesma URL> --compare piloto-ciclo-1.json --save piloto-ciclo-2.json --out piloto-ciclo-2.md
```

Saída 0 quando nada falha, 1 quando alguma verificação falha e 2 para uso incorreto.

| ID | Verificação | Falha quando |
| --- | --- | --- |
| C01 | Contrato `schemaVersion: 1` na primeira página, ou corpo de erro 404/503 documentado | Campo obrigatório ausente, URL não https ou privada, `permalink` fora do Instagram, vídeo sem capa, `slug` de outra vitrine, chave proibida (`accessToken`, `owner_user_id`, `webhookSecret`…) ou valor com formato de token |
| C02 | Leitura pública sem sessão | A resposta define cookie |
| C03 | CORS libera `https://ganja.inspira.dev.br` | `Access-Control-Allow-Origin` ausente ou diferente. `*` gera aviso |
| C04 | CORS nega uma origem não autorizada | A origem estranha recebe liberação |
| C05 | Paginação completa | Página com erro, `id` repetido entre páginas, ordem `publishedAt` quebrada ou cursor em laço |
| C06 | Formatos presentes | Nunca falha. Avisa quando a conta não tem foto, carrossel ou vídeo, e esse cenário fica sem execução |
| C07 | Cache por `ETag` | Nunca falha. Avisa quando falta `ETag` ou quando `If-None-Match` não devolve 304 |
| C08 | Isolamento entre vitrines (`--other-url`) | A outra vitrine devolve o mesmo slug, o mesmo perfil ou as mesmas publicações, ou aceita o cursor da Ganja sem `400 INVALID_CURSOR` |
| C09 | Comparação com o ciclo anterior (`--compare`) | Publicações mudaram e o `hash` continua igual. Lista as publicações novas e as removidas |
| C10 | Estado da projeção | Nunca falha. Avisa quando o estado é `stale` ou `empty` |

O script cobre só a leitura pública. Autorização, cancelamento, revogação, reconexão e exclusão acontecem no painel e na Meta, e seguem os passos manuais abaixo.

## Roteiro por item da ganja #6

Em todos os itens, a evidência real tem que vir do Vitrine em produção com a conta de teste. A evidência automatizada mostra só como a Ganja reage ao contrato.

### 1. Autorização, cancelamento e vínculo à vitrine correta

- **Piloto real:** o dono entra no painel e abre "Conectar Instagram" na vitrine `ganja`, autoriza e confere `@ganjastudio.br` no painel. Repetir cancelando a tela da Meta e depois recusando a permissão: nenhum vínculo é criado. Rodar `check-feed.mjs` e conferir que C01 passa com `slug: ganja` e `profile.username: ganjastudio.br`.
- **Ganja hoje:** a Ganja recusa uma projeção cujo `slug` não seja o da URL configurada (erro `SLUG_MISMATCH`). Nesse caso a faixa volta ao arquivo estático com o selo de indisponível. Testes: `vitrineContract.test.tsx` ("refuses a projection that belongs to another storefront", "never renders another storefront") e Playwright FV07.
- **Status:** bloqueado (itens 8, 11, 14 e 16 do checklist Vitrine e a vitrine #49 sem implementação).

### 2. Importação paginada, repetição sem duplicatas e nova publicação no próximo ciclo

- **Piloto real:** com a conta tendo mais de 12 publicações, rodar o script com `--save` (C05 percorre todas as páginas). Publicar um post no Instagram, esperar o ciclo do Vitrine (60 min recomendados, a confirmar na vitrine #50) e rodar com `--compare`: C09 mostra `+1 nova(s)` e revisão maior. Rodar uma segunda vez sem novos posts: C09 mostra `+0`, `−0`.
- **Ganja hoje:** o cursor opaco vem de `pageInfo.nextCursor` e a paginação para em `hasNextPage: false`. "Carregar mais" ignora `id` já exibido quando uma sincronização desloca posts entre páginas. Testes: `vitrineContract.test.tsx` ("walks every page…", "skips a repeated post…"), `instagramPilotCheck.test.ts` (duplicatas, comparação entre ciclos) e Playwright FV01.
- **Status:** bloqueado (rota pública e sincronização não implementadas).

### 3. Conta vazia, foto, carrossel, vídeo, postagem removida e falha da API

- **Piloto real:** C06 informa quais formatos a conta tem. Arquivar ou apagar um post e, depois do ciclo, rodar com `--compare` (C09 lista a removida). Abrir `#/feed` e conferir que o post sumiu. Conta vazia: testar com a conta de teste sem posts ou com todos ocultos no painel (`status: "empty"`). Falha: o Vitrine deve servir `status: "stale"` quando já existe versão válida, ou `503 FEED_UNAVAILABLE` quando não existe.
- **Ganja hoje:** cartões de foto, carrossel (com número de mídias de `children`) e capa de vídeo, sem reprodução automática. Estados vazio, `stale` (selo "ÚLTIMA SINCRONIZAÇÃO VÁLIDA — DESATUALIZADO" na página e na faixa), falha 503 com "Tentar novamente" e `400 INVALID_CURSOR` em "Carregar mais", que mantém os posts já exibidos. Testes: `vitrineContract.test.tsx` e Playwright FV01, FV02, FV03, FV06 e FV08.
- **Status:** bloqueado. Quais formatos a API devolve só se confirma com a conta real.

### 4. Expiração, revogação, reconexão, desconexão e remoção

- **Piloto real:** remover o app em Instagram → Configurações → Apps e sites. O Vitrine recebe `/deauthorize`, para os jobs e passa a responder `404 FEED_NOT_FOUND`. Rodar o script: C01 mostra "conta desconectada". Em `#/feed` aparece "Conta desconectada" com "Gerenciar no Vitrine", sem publicações, e a faixa volta ao arquivo estático. Reconectar pelo painel e conferir que o feed volta no ciclo seguinte. Pedir exclusão de dados e conferir a resposta de `/data-deletion` e a política de retenção da vitrine #50.
- **Ganja hoje:** `404` com `FEED_NOT_FOUND` ou `status: "disconnected"`, e o `410` provisório, levam ao estado desconectado. Um `404` sem esse corpo é tratado como falha, para que uma URL errada não apareça como "desconectada". Testes: `vitrineContract.test.tsx`, `feedSource.test.ts` e Playwright FV04.
- **Status:** bloqueado (item 14 do checklist e vitrine #49/#50 sem implementação). A expiração real do token não pode ser simulada na Ganja.

### 5. Isolamento com outra vitrine e ausência de segredos no navegador

- **Piloto real:** criar uma segunda vitrine de teste com outra conta e rodar com `--other-url` (C08). Com um usuário da equipe da outra vitrine, tentar abrir a integração da `ganja` no painel: o acesso deve ser negado. No navegador, abrir DevTools → Network em `https://ganja.inspira.dev.br/#/feed` e conferir que a requisição do feed vai sem cookie, `Authorization` ou token, e que a resposta não traz chaves privadas (C01, C02).
- **Ganja hoje:** o adaptador faz `GET` com `credentials: 'omit'`, sem cabeçalho de autorização, e só copia os campos permitidos. Uma chave privada que vaze na resposta nunca chega ao modelo da página. Testes: `vitrineContract.test.tsx` ("only maps allowlisted fields…"), `instagramPilotCheck.test.ts` e Playwright FV01. O build não contém segredos: só `VITE_VITRINE_FEED_URL` e `VITE_VITRINE_MANAGE_URL`, ambas públicas.
- **Status:** bloqueado no lado Vitrine (RLS, CORS por vitrine e cursor ligado à vitrine sem implementação).

### 6. Evidências e bloqueios

Registrar cada execução na tabela abaixo e comentar o resultado na ganja #6, com o relatório do script anexado. Não marcar um item como validado sem uma linha preenchida.

| Data | Item | Ambiente | Quem executou | Resultado | Evidência |
| --- | --- | --- | --- | --- | --- |
| — | 1–5 | — | — | Não executado: bloqueios acima | — |

## Ativação na Ganja

Quando a rota pública responder em produção:

1. Rodar `check-feed.mjs` contra a URL de produção. Todos os itens obrigatórios (C01–C05, C08) devem passar.
2. Em `.github/workflows/pages.yml`, no passo "Build for GitHub Pages", adicionar `VITE_VITRINE_FEED_URL` (URL pública do feed) e, quando a vitrine #49 entregar o destino exato, `VITE_VITRINE_MANAGE_URL`. As duas são públicas. Nenhum segredo entra no build.
3. Depois do deploy, conferir que a faixa diz "FEED SINCRONIZADO VIA VITRINE" e que `#/feed` pagina.
4. Executar os itens 1–5 e preencher a tabela de evidências.

A Ganja não recebe o webhook `instagram.feed.updated`. O site é estático no GitHub Pages e não tem servidor para validar HMAC. O navegador lê a rota principal, que tem `Cache-Control` curto e `ETag`, então posts novos aparecem quando o cache expira.

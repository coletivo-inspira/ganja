# Piloto Instagram da Ganja

Data: 12/11/2026. Status: planejamento documental; nenhuma integração ou configuração de produção implementada.

## Objetivo e ponto de partida

Exibir o feed autorizado de @ganjastudio.br e permitir que o dono gerencie a conexão no painel Vitrine. Hoje, a faixa usa INSTAGRAM_STRIP_ITEMS em src/data/creator.ts, renderizada em src/components/CreatorContactFooter.tsx; são imagens fixas, não sincronização Instagram.

## Caminho das pedras

1. Resolver configuração Meta e conexão pelo painel no Vitrine, com consentimento do dono e vínculo à vitrine correta.
2. Aguardar a definição do contrato público e sincronização. Ganja consome só dados públicos do Vitrine, sem tokens nem chamadas autenticadas diretas ao Instagram.
3. Planejar substituição da faixa fixa por publicações reais, preservando tipografia, geometria, tratamento visual e links originais. Mapear fotos, carrosséis e capas de vídeos sem prometer reprodução de formatos ainda não validados.
4. Planejar página pública do feed com paginação e acesso pelo menu. Prever link de gestão para painel.inspira.dev.br, com destino da vitrine validado na implementação; o painel exige login e autorização.
5. Definir carregamento, estado vazio, falha temporária e desconexão. Não apresentar material estático como conteúdo sincronizado.
6. Executar o piloto somente após implementar as dependências e confirmar liberação Meta aplicável.

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

Estes são cenários a executar após a implementação, não resultados de testes já realizados. Registrar evidências e bloqueios na issue Ganja #6.

## Pendências e referência

Confirmar conta profissional, responsável Meta, infraestrutura, frequência, histórico/mídias disponíveis e política de retenção nas issues Vitrine #48–#51. O link do perfil sozinho não concede acesso ao feed.

[Roteiro central do Vitrine](https://github.com/coletivo-inspira/vitrine/blob/codex/instagram-integration-roadmap/docs/instagram-integration-roadmap.md).

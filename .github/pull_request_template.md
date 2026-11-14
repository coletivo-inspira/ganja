<!--
Título no padrão Conventional Commits, em português: tipo(escopo): descrição
Exemplo: fix(hero): liberar rolagem vertical ao tocar nos stickers
Veja CONTRIBUTING.md para tipos e escopos.
-->

## O que muda

<!-- O que a pessoa que visita o site ou mantém o repositório passa a ver ou fazer. -->

## Issues

<!-- Closes #N quando todos os critérios de aceite são cumpridos; Refs #N caso contrário. -->

## Evidências

<!-- Critério de aceite → como foi verificado. Capturas em 1440px e 390px quando houver mudança visual. -->

## Verificação

- [ ] `npm run test:unit`
- [ ] `npm run build`
- [ ] `npx playwright test` (quando toca interface)
- [ ] Conferido em 1440px e 390px, com toque emulado quando relevante
- [ ] Regras brutalistas mantidas: raio 0, sem blur, grade de 1px, sombras duras
- [ ] `TEST_READY.md` atualizado quando as contagens de testes mudam

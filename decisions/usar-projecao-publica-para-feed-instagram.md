# Usar projeção pública do Vitrine para o feed Instagram

Data: 2026-11-12
Estado: proposto

## Contexto

O site estático Ganja precisa exibir publicações autorizadas pela marca, sem distribuir credenciais. O Vitrine planeja administrar contas e sincronização para várias vitrines. Ainda não há evidência de que o serviço e o contrato público estejam operacionais. A configuração Meta depende da issue coletivo-inspira/vitrine#48.

## Decisão

A Ganja consumirá uma projeção pública por vitrine, fornecida pelo Vitrine. Autorização, credenciais, sincronização e desconexão pertencem ao Vitrine. O histórico disponível será paginado e o site exibirá estados de carregamento, vazio e falha. A frequência inicialmente proposta é de 60 minutos, sujeita à validação das cotas.

## Consequências

O navegador não precisa guardar tokens e o serviço poderá atender outras marcas. A implementação e disponibilidade da Ganja passam a depender do contrato e da operação do Vitrine. O piloto exige conta profissional, consentimento e configuração Meta comprovados. A retenção, invalidação de cache e o formato do contrato exigem validação no projeto Vitrine antes da integração.

Referências: Ganja #4–#6, Vitrine #48–#51 e `docs/instagram-integration-roadmap.md`.

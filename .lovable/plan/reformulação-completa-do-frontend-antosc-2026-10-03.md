# Reformulação completa do frontend ANTOSC

## Objetivo
Transformar o frontend atual num centro operacional claro, moderno e confiável para equipas NOC e gestores, mantendo a API e autenticação existentes. A interface dará prioridade ao que exige ação, sem inventar dados nem apresentar leituras conhecidamente incorretas como factos.

## Direção visual
- Ambiente operacional claro: fundo cinza muito suave, superfícies brancas, texto grafite, azul para ações e navegação, verde/âmbar/vermelho apenas para estados.
- Navegação lateral compacta e persistente, cabeçalho com contexto da página, pesquisa e estado da última atualização.
- Maior densidade informativa, hierarquia forte e menos “cartões iguais”; tabelas, gráficos e painéis ajustados a desktop e telemóvel.
- Tipografia sóbria e técnica, números tabulares e microinterações discretas com respeito pela redução de movimento.

## Estrutura da aplicação
1. **Visão geral**
   - Saúde do parque, recolha, disponibilidade válida, alarmes e sites que requerem atenção.
   - Separar indicadores executivos da fila operacional de problemas.
   - Tendências por região, operador e fabricante, usando apenas dados confirmados.

2. **Sites**
   - Inventário avançado com pesquisa, filtros por estado de recolha, região, operador e fabricante, ordenação e paginação na URL.
   - Colunas focadas em identidade, última recolha, qualidade dos dados, energia disponível e problema atual.
   - Seleção de um site conduz à página completa de detalhe, eliminando a duplicação atual entre janela e página.

3. **Detalhe do site**
   - Cabeçalho com identidade, localização, operador, fabricante, recolha e ações relevantes.
   - Separadores para resumo, energia, telemetria, gerador, alarmes/eventos e localização.
   - Conteúdo adaptado ao fabricante: Huawei, Enetek e Eltek mostram apenas métricas suportadas; Vertiv e transit_router recebem um estado claro de telemetria indisponível.
   - Gráficos temporais, última leitura, origem e qualidade visíveis junto de cada grupo de métricas.

4. **Alarmes e eventos**
   - Caixa operacional unificada com severidade, site, duração, estado da recolha e mensagem de erro.
   - Filtros úteis, detalhe lateral e exportação existente preservada.
   - Tickets aparecem como entidade separada quando os dados reais estiverem disponíveis.

5. **Mapa**
   - Mapa com estado operacional, agrupamento e filtros consistentes com o inventário.
   - Distinguir coordenadas reais, aproximadas por região e sites sem localização.

6. **Operadores e relatórios**
   - “Equipas” passa a representar corretamente operadores, sem campos locais que desaparecem ao recarregar.
   - “Relatórios” mostra apenas exportações realmente suportadas; controlos sem efeito e relatórios fictícios serão removidos.
   - “Equipamentos” será integrado no detalhe do site enquanto o backend não expuser equipamentos como entidades independentes.
   - Remover o acesso quebrado a Configurações e corrigir toda a navegação.

## Integridade e qualidade dos dados
- Criar uma linguagem visual única para: nunca recolhido, falha atual, sem sensor, não suportado pelo fabricante, valor suspeito, integração não confirmada e dado aproximado.
- Não confiar no `status` como única fonte enquanto ele não refletir a condição real; cruzar com `collection_status`, `last_successful_at` e erros de recolha.
- Nunca mostrar disponibilidade de 100% quando o site nunca recolheu.
- Tratar datas `0001-01-01`, placeholders SNMP e UUIDs sem nome como dados ausentes/configuração incompleta.
- Validar leituras fisicamente suspeitas: temperaturas sentinela, zeros de sensores ausentes, percentagem de combustível incorreta, combustível acima de 1000 L e estados sem legenda.
- Métricas conhecidamente não confiáveis ficam ocultas ou explicitamente assinaladas; valores ausentes nunca serão convertidos em zero.

## Implementação técnica
- Migrar o frontend fornecido para a base TanStack Start atual, preservando os endpoints e contratos de API.
- Centralizar consultas e adaptadores partilhados para sites, regiões, operadores e métricas; manter TanStack Query como camada de cache.
- Usar loaders com `ensureQueryData` e `useSuspenseQuery` nos dados iniciais, com estados de erro e ausência por página.
- Colocar pesquisa, filtros, ordenação, página e separador do detalhe nos parâmetros da URL.
- Consolidar formatação, unidades, estados de qualidade e regras específicas por fabricante em módulos reutilizáveis.
- Manter a URL da API configurável por ambiente e retirar credenciais de demonstração do fluxo de produção.
- Evitar pedidos de eventos por site em massa; consumir a melhor consulta agregada já disponível e degradar de forma clara quando o backend não a suportar.
- Definir metadados próprios em todas as páginas e garantir navegação tipada sem destinos inexistentes.

## Validação
- Confirmar os fluxos completos: visão geral → filtro → site → telemetria/alarme → regresso à lista.
- Verificar estados com dados completos, parciais, suspeitos, nunca recolhidos e erros da API.
- Testar desktop e telemóvel, incluindo tabelas, mapa, navegação e ausência de sobreposições.
- Confirmar que a aplicação compila sem erros e que a API atual continua a ser usada sem alterações no backend.

## Limites desta fase
- Não serão criados endpoints, modelos de equipamentos, equipas internas, manutenção persistente ou relatórios que o backend ainda não suporta.
- Funcionalidades atualmente simuladas serão removidas ou apresentadas honestamente como indisponíveis, sem falsa sensação de persistência.

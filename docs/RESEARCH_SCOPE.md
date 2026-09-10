# Research scope · Escopo de pesquisa

## English

A mission-energy workbench for explicit capacity, power, dwell-time and reserve assumptions. It compares nominal consumption with lower and upper deterministic scenarios and includes an explicit return segment.

The Unitree Go2 PRO is the reference platform for the planned supervised research workflow. This release provides offline software evidence and does not claim an implemented hardware connection.

Measure repeated operator-supervised trials with a documented configuration, environment and load. Record usable capacity and segment power using supported measurement methods. Replace illustrative values, compare predicted and measured Wh, and select reserves through a separately reviewed operating protocol.

## Português

Uma bancada de energia de missões com hipóteses explícitas de capacidade, potência, permanência e reserva. Compara consumo nominal com cenários determinísticos inferior e superior e inclui um segmento explícito de retorno.

O Unitree Go2 PRO é a plataforma de referência para o fluxo de pesquisa supervisionada planejado. Esta versão produz evidências de software offline e não afirma possuir conexão implementada com hardware.

Meça ensaios repetidos e supervisionados por operador, com configuração, ambiente e carga documentados. Registre capacidade utilizável e potência por segmento com métodos de medição compatíveis. Substitua os valores ilustrativos, compare Wh previstos e medidos e selecione reservas por meio de protocolo operacional revisado separadamente.

## Readiness · Estágio de desenvolvimento

| Layer · Etapa                                                     | Status · Estado                            | Evidence · Evidência                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Domain software · Software de domínio                             | Implemented · Implementado                 | Engine, tests, examples and reports · Mecanismo, testes, exemplos e relatórios                                |
| Browser and CLI · Navegador e linha de comando                    | Implemented · Implementado                 | Same calculation in both interfaces · Mesmo cálculo nas duas interfaces                                       |
| Vendor/device adapter · Adaptador de fabricante/dispositivo       | Future, conditional · Futuro, condicionado | Requires supported interface and separate implementation · Exige interface compatível e implementação própria |
| Physical validation · Validação física                            | Planned · Planejada                        | Measured, controlled comparison protocol · Protocolo medido de comparação controlada                          |
| Participant or field study · Estudo com participantes ou em campo | Not established · Não estabelecido         | Requires separate review and evidence · Exige revisão e evidências próprias                                   |

## Boundaries · Limites

The supplied power and capacity values are illustrative, not measured Go2 PRO specifications. Constant power does not model gait transitions, terrain, acceleration, battery temperature, aging or voltage sag. The return estimate is supplied explicitly and does not calculate a return route. A feasible result is conditional on these assumptions.

Os valores de potência e capacidade são ilustrativos, não especificações medidas do Go2 PRO. Potência constante não modela mudanças de marcha, terreno, aceleração, temperatura, envelhecimento ou queda de tensão da bateria. A estimativa de retorno é informada explicitamente e não calcula uma rota de retorno. Um resultado viável depende dessas hipóteses.

Independent public research work. No vendor endorsement, institutional partnership, emergency-use validation, clinical efficacy or physical guidance guarantee is claimed.  
Trabalho público independente de pesquisa. Não se afirma endosso do fabricante, parceria institucional, validação para emergências, eficácia clínica ou garantia de orientação física.

## Platform reference · Referência da plataforma

Standard PRO is not listed for secondary development; custom access requires confirmation.  
A versão PRO padrão não é listada para desenvolvimento secundário; o acesso personalizado exige confirmação. [Unitree Go2 configuration table · Tabela oficial de configuração](https://www.unitree.com/go2/) — checked / consultada: 2026-09-10.

The existence of an SDK does not establish that a particular purchased configuration exposes its interfaces.  
A existência de um SDK não comprova que uma configuração adquirida ofereça suas interfaces. [Official SDK repository · Repositório oficial do SDK](https://github.com/unitreerobotics/unitree_sdk2).

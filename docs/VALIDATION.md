# Validation · Validação

## English

Version 0.1.0 includes **28 automated tests** covering domain behavior, rejected inputs, immutability, deterministic exports, JSON compatibility, native control bounds and the command-line adapter. Tests exercise outcomes and boundary cases rather than hardware capabilities. CI runs on Ubuntu and Windows with Node.js 22 and 24.

```sh
npm test
npm run examples
npm run test:coverage
```

The versioned examples include nominal behavior and deliberate edge cases. A `review-required` example is expected to produce findings; it is not a failed software test. `npm run examples` checks reports against committed artifacts. The coverage command reports exercised code and does not establish physical validity.

### Browser review

1. Load each example and check the expected report status in `examples/index.json`.
2. Switch between English and Portuguese; confirm labels, findings and text alternatives.
3. Change the primary control and check that the chart and report agree.
4. Import malformed JSON and an unknown field. Confirm explicit rejection without replacing the last valid report.
5. Move the review cursor, export both artifacts and rerun the scenario with the command-line adapter.
6. Check keyboard focus, a narrow viewport, and long labels. Charts have text alternatives and underlying records.

### Domain reference case

The nominal scenario uses a hypothetical 200 Wh capacity with a 0.9 factor, 80% initial charge and 25% reserve: 144 Wh available and 45 Wh reserved. Two 60 m traversals plus a ten-minute observation consume 25.5 Wh nominally. At 20% power uncertainty, upper consumption is 30.6 Wh and margin after reserve is 68.4 Wh.

### Physical evidence

No physical integration, participant trial or field deployment has been validated in this release. A future study must record configuration, environment, measurement methods, uncertainty, interruptions and the exact software version. Passing software tests cannot substitute for that record.

## Português

A versão 0.1.0 inclui **28 testes automatizados**, cobrindo comportamento de domínio, entradas rejeitadas, imutabilidade, exportação determinística, compatibilidade JSON, limites dos controles nativos e interface de linha de comando. Os testes avaliam resultados e casos limite, não capacidades do hardware. A integração contínua executa em Ubuntu e Windows com Node.js 22 e 24.

Os exemplos versionados incluem comportamento nominal e casos limite deliberados. Um exemplo `review-required` deve produzir apontamentos; isso não representa falha do teste de software. `npm run examples` compara os relatórios aos artefatos versionados. O comando de cobertura informa o código exercitado e não comprova validade física.

### Revisão no navegador

1. Abra cada exemplo e confira o estado esperado em `examples/index.json`.
2. Alterne entre português e inglês; confira rótulos, apontamentos e alternativas textuais.
3. Altere o controle principal e confira a coerência entre gráfico e relatório.
4. Importe JSON malformado e um campo desconhecido. Confirme rejeição explícita sem substituir o último relatório válido.
5. Mova o cursor, exporte os dois artefatos e execute novamente o cenário pela linha de comando.
6. Confira foco por teclado, janela estreita e rótulos longos. Os gráficos têm alternativas textuais e registros correspondentes.

### Caso de referência do domínio

O cenário nominal usa capacidade hipotética de 200 Wh com fator 0,9, carga inicial de 80% e reserva de 25%: 144 Wh disponíveis e 45 Wh reservados. Dois percursos de 60 m e dez minutos de observação consomem nominalmente 25,5 Wh. Com incerteza de potência de 20%, o consumo superior é 30,6 Wh e a margem após a reserva é 68,4 Wh.

### Evidências físicas

Esta versão não valida integração física, estudo com participantes ou operação em campo. Um estudo futuro deve registrar configuração, ambiente, métodos de medição, incertezas, interrupções e a versão exata do software. Testes de software aprovados não substituem esse registro.

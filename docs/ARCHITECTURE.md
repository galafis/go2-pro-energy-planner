# Architecture · Arquitetura

[README](../README.md) · [Data contract · Contrato de dados](DATA_CONTRACT.md)

## English

The domain engine in `src/engine.js` is independent of the document, network and local storage. The same `run(input)` function powers the browser and command-line interface. Awaiting it works for every project, including the asynchronous journal hashing operation.

```text
scenario JSON → strict validation → deterministic domain engine → report
                                                           ↘ bilingual view
```

- Motion time equals distance divided by supplied speed. Dwell time is added separately.
- Integrate constant segment power over time and convert watt-seconds to watt-hours by dividing by 3,600. Auxiliary power applies during motion and dwell.
- Effective capacity equals capacityWh multiplied by capacityFactor. Both available energy and the requested reserve are fractions of effective capacity, not fractions of one another.
- The uncertainty percentage scales all segment energy together. It represents a fully correlated scenario multiplier, not independent noise or a statistical confidence interval.
- Exactly one return segment must be last. A zero-distance return is permitted but remains explicit.
- Feasibility requires upper estimated consumption plus reserve to fit available energy. Deficits remain negative in the report; the display never clips a deficit into a successful result.

### Model

```text
E(Wh) = ((motionW + auxW) × distanceM / speedMps + (idleW + auxW) × dwellS) / 3600
```

Inputs are checked before computation and are not mutated. Unknown keys are rejected at the validated scenario and nested-domain boundaries. Reports contain no wall-clock creation timestamp, so the same input produces identical JSON under the same analysis version. UI formatting changes decimal separators without changing exported numeric values.

The browser parses imports locally, limits them to 1 MB, renders supplied text through escaping, and discards stale asynchronous results using a revision counter. It retains only the language preference automatically. Charts are previews; complete records remain in exports. The local development server binds to `127.0.0.1` and rejects hidden or out-of-root paths.

## Português

O mecanismo de domínio em `src/engine.js` é independente do documento, da rede e do armazenamento local. A mesma função `run(input)` atende ao navegador e à interface de linha de comando. Ela pode ser aguardada com `await` em todos os projetos, inclusive no cálculo assíncrono dos hashes do registro.

```text
cenário JSON → validação estrita → mecanismo determinístico → relatório
                                                       ↘ visualização bilíngue
```

- O tempo de movimento é a distância dividida pela velocidade informada. O tempo de permanência é somado separadamente.
- Integre a potência constante de cada segmento no tempo e converta watt-segundos em watt-hora dividindo por 3.600. A potência auxiliar incide no movimento e na permanência.
- A capacidade efetiva é capacityWh multiplicada por capacityFactor. Energia disponível e reserva solicitada são frações da capacidade efetiva, não uma da outra.
- A porcentagem de incerteza multiplica a energia de todos os segmentos conjuntamente. Representa um cenário totalmente correlacionado, não ruído independente nem intervalo de confiança estatístico.
- Deve existir exatamente um segmento de retorno na última posição. Retorno de distância zero é permitido, mas permanece explícito.
- A viabilidade exige que consumo superior estimado mais reserva caibam na energia disponível. Os déficits permanecem negativos no relatório; a interface não os converte em resultados de sucesso.

As entradas são verificadas antes do cálculo e não são alteradas. Chaves desconhecidas são rejeitadas no cenário e nas estruturas de domínio validadas. Os relatórios não incluem horário real de criação; assim, a mesma entrada produz JSON idêntico sob a mesma versão da análise. A formatação visual altera separadores decimais sem alterar os valores numéricos exportados.

O navegador lê as importações localmente, limita-as a 1 MB, escapa textos informados antes da exibição e descarta resultados assíncronos antigos com um contador de revisão. Apenas a preferência de idioma é armazenada automaticamente. Os gráficos são prévias; os registros completos permanecem na exportação. O servidor local atende em `127.0.0.1` e rejeita caminhos ocultos ou externos à pasta.

## Files · Arquivos

| Path · Caminho        | Responsibility · Responsabilidade                                                       |
| --------------------- | --------------------------------------------------------------------------------------- |
| `src/engine.js`       | Domain behavior · Comportamento de domínio                                              |
| `src/validation.js`   | Strict primitives and report contract · Validação e contrato do relatório               |
| `src/view.js`         | Project-specific chart and interpretation · Gráfico e interpretação próprios do projeto |
| `src/app.js`          | Browser workflow, imports and language · Fluxo do navegador, importações e idioma       |
| `src/ui.js`           | Escaping, formatting and downloads · Escape de texto, formatação e downloads            |
| `scripts/analyze.mjs` | Command-line adapter · Adaptador de linha de comando                                    |
| `tests/`              | Behavioral and contract checks · Verificações de comportamento e contrato               |
| `examples/`           | Synthetic inputs and expected reports · Entradas sintéticas e relatórios esperados      |

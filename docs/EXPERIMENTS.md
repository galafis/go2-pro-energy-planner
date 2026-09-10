# Worked examples · Exemplos comentados

[README](../README.md)

**English:** These are executable synthetic scenarios. Each command recomputes the committed report. Change one field at a time, retain the source file and inspect unfavorable findings as well as headline metrics.

**Português:** Estes são cenários sintéticos executáveis. Cada comando recalcula o relatório versionado. Altere um campo por vez, preserve a entrada e inspecione achados desfavoráveis junto das métricas principais.

## Corridor mission · Missão em corredor

```sh
node scripts/analyze.mjs examples/nominal.json report.json
```

[Scenario / Cenário](../examples/nominal.json) · [Expected report / Relatório esperado](../examples/nominal.report.json) · `complete`

| Metric · Métrica                             | Expected · Esperado |
| -------------------------------------------- | ------------------- |
| Nominal energy / Energia nominal             | 25.5 Wh             |
| Upper estimate / Estimativa superior         | 30.6 Wh             |
| Margin after reserve / Margem após a reserva | 68.4 Wh             |
| Mission duration / Duração da missão         | 14 min              |

## Insufficient reserve · Reserva insuficiente

```sh
node scripts/analyze.mjs examples/reserve-deficit.json report.json
```

[Scenario / Cenário](../examples/reserve-deficit.json) · [Expected report / Relatório esperado](../examples/reserve-deficit.report.json) · `review-required`

| Metric · Métrica                             | Expected · Esperado |
| -------------------------------------------- | ------------------- |
| Nominal energy / Energia nominal             | 50.5 Wh             |
| Upper estimate / Estimativa superior         | 60.6 Wh             |
| Margin after reserve / Margem após a reserva | -33.6 Wh            |
| Mission duration / Duração da missão         | 34 min              |

- `RESERVE_DEFICIT`: The upper energy estimate consumes the requested reserve. / A estimativa superior de energia consome a reserva solicitada.

## Auxiliary load · Carga auxiliar

```sh
node scripts/analyze.mjs examples/auxiliary-load.json report.json
```

[Scenario / Cenário](../examples/auxiliary-load.json) · [Expected report / Relatório esperado](../examples/auxiliary-load.report.json) · `complete`

| Metric · Métrica                             | Expected · Esperado |
| -------------------------------------------- | ------------------- |
| Nominal energy / Energia nominal             | 40.67 Wh            |
| Upper estimate / Estimativa superior         | 48.8 Wh             |
| Margin after reserve / Margem após a reserva | 50.2 Wh             |
| Mission duration / Duração da missão         | 14 min              |

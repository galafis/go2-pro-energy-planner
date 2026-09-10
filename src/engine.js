import {
  base,
  number,
  list,
  object,
  choice,
  identifier,
  unique,
  requireThat,
  metric,
  finding,
  round,
  report,
} from './validation.js';

export function validate(input) {
  base(input, [
    'capacityWh',
    'capacityFactor',
    'stateOfChargePct',
    'reservePct',
    'uncertaintyPct',
    'segments',
  ]);
  number(input.capacityWh, 'capacityWh', 0.01, 100000);
  number(input.capacityFactor, 'capacityFactor', 0.01, 1);
  number(input.stateOfChargePct, 'stateOfChargePct', 0, 100);
  number(input.reservePct, 'reservePct', 0, 100);
  number(input.uncertaintyPct, 'uncertaintyPct', 0, 100);
  list(input.segments, 'segments', 1, 1000);
  input.segments.forEach((segment, index) => {
    object(segment, `segments[${index}]`, [
      'id',
      'phase',
      'distanceM',
      'speedMps',
      'dwellS',
      'motionW',
      'idleW',
      'auxW',
    ]);
    identifier(segment.id, 'id');
    choice(segment.phase, 'phase', ['outbound', 'task', 'return']);
    number(segment.distanceM, 'distanceM', 0, 100000);
    number(segment.speedMps, 'speedMps', 0.01, 10);
    number(segment.dwellS, 'dwellS', 0, 86400);
    for (const field of ['motionW', 'idleW', 'auxW']) number(segment[field], field, 0, 10000);
    requireThat(
      (index === input.segments.length - 1) === (segment.phase === 'return'),
      'RETURN_POSITION',
      'Exactly one return segment must be last, even when its distance is zero.',
      'Deve existir exatamente um segmento de retorno, na última posição, mesmo com distância zero.',
    );
  });
  unique(
    input.segments.map((s) => s.id),
    'segments',
  );
  return input;
}

export function segmentEnergy(segment) {
  const motionS = segment.distanceM / segment.speedMps;
  const durationS = motionS + segment.dwellS;
  const energyWh =
    ((segment.motionW + segment.auxW) * motionS + (segment.idleW + segment.auxW) * segment.dwellS) /
    3600;
  return { motionS, durationS, energyWh };
}

/** Deterministic bounds use one fully correlated power multiplier, not a probability model. */
export function run(input) {
  validate(input);
  const effectiveCapacityWh = input.capacityWh * input.capacityFactor;
  const availableWh = (effectiveCapacityWh * input.stateOfChargePct) / 100;
  const reserveWh = (effectiveCapacityWh * input.reservePct) / 100;
  const factor = input.uncertaintyPct / 100;
  const records = [],
    findings = [];
  let usedWh = 0,
    totalDurationS = 0,
    totalDistanceM = 0;
  for (const segment of input.segments) {
    const energy = segmentEnergy(segment);
    usedWh += energy.energyWh;
    totalDurationS += energy.durationS;
    totalDistanceM += segment.distanceM;
    const highWh = energy.energyWh * (1 + factor);
    const remainingWorstWh = availableWh - usedWh * (1 + factor);
    records.push({
      id: segment.id,
      phase: segment.phase,
      durationS: round(energy.durationS),
      distanceM: segment.distanceM,
      energyWh: round(energy.energyWh),
      lowWh: round(energy.energyWh * (1 - factor)),
      highWh: round(highWh),
      cumulativeWh: round(usedWh),
      remainingNominalWh: round(availableWh - usedWh),
      remainingWorstWh: round(remainingWorstWh),
      reserveBreached: remainingWorstWh < reserveWh - 1e-9,
    });
  }
  const lowWh = usedWh * (1 - factor),
    highWh = usedWh * (1 + factor);
  const marginWh = availableWh - highWh - reserveWh;
  if (availableWh < reserveWh - 1e-9)
    findings.push(
      finding(
        'error',
        'BELOW_INITIAL_RESERVE',
        'The initial charge is below the requested reserve.',
        'A carga inicial está abaixo da reserva solicitada.',
      ),
    );
  if (marginWh < -1e-9)
    findings.push(
      finding(
        'error',
        'RESERVE_DEFICIT',
        'The upper energy estimate consumes the requested reserve.',
        'A estimativa superior de energia consome a reserva solicitada.',
        { deficitWh: round(-marginWh) },
      ),
    );
  if (availableWh - highWh < -1e-9)
    findings.push(
      finding(
        'error',
        'CAPACITY_DEFICIT',
        'The upper energy estimate exceeds the available energy.',
        'A estimativa superior de energia excede a energia disponível.',
      ),
    );
  const returnHighWh = segmentEnergy(input.segments.at(-1)).energyWh * (1 + factor);
  return report(
    input,
    'go2-pro-energy-planner',
    [
      metric('expectedWh', 'Nominal energy', 'Energia nominal', round(usedWh, 2), 'Wh'),
      metric('upperWh', 'Upper estimate', 'Estimativa superior', round(highWh, 2), 'Wh'),
      metric('marginWh', 'Margin after reserve', 'Margem após a reserva', round(marginWh, 2), 'Wh'),
      metric(
        'durationMin',
        'Mission duration',
        'Duração da missão',
        round(totalDurationS / 60, 2),
        'min',
      ),
    ],
    findings,
    records,
    {
      availableWh: round(availableWh),
      reserveWh: round(reserveWh),
      effectiveCapacityWh: round(effectiveCapacityWh),
      nominalWh: round(usedWh),
      lowWh: round(lowWh),
      highWh: round(highWh),
      marginWh: round(marginWh),
      returnHighWh: round(returnHighWh),
      taskBudgetWh: round(Math.max(0, availableWh - reserveWh - returnHighWh)),
      totalDurationS: round(totalDurationS),
      totalDistanceM: round(totalDistanceM),
      feasibleWithinAssumptions: marginWh >= -1e-9,
    },
  );
}

export function reserveSweep(input, values = [0, 10, 20, 30, 40]) {
  validate(input);
  list(values, 'values', 1, 101);
  return values.map((reservePct) => {
    number(reservePct, 'reservePct', 0, 100);
    const result = run({ ...input, reservePct });
    return {
      reservePct,
      marginWh: result.marginWh,
      feasibleWithinAssumptions: result.feasibleWithinAssumptions,
    };
  });
}

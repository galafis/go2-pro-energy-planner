import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { run, segmentEnergy, reserveSweep } from '../src/engine.js';
const fixture = () =>
  JSON.parse(readFileSync(new URL('../examples/nominal.json', import.meta.url)));
test('nominal mission matches an independent Wh calculation', () => {
  const r = run(fixture());
  assert.equal(r.nominalWh, 25.5);
  assert.equal(r.highWh, 30.6);
  assert.equal(r.availableWh, 144);
  assert.equal(r.reserveWh, 45);
  assert.equal(r.marginWh, 68.4);
});
test('one watt for one hour consumes one Wh', () => {
  const e = segmentEnergy({
    distanceM: 0,
    speedMps: 1,
    dwellS: 3600,
    motionW: 0,
    idleW: 1,
    auxW: 0,
  });
  assert.equal(e.energyWh, 1);
});
test('auxiliary power applies during both motion and dwell', () => {
  const e = segmentEnergy({
    distanceM: 1800,
    speedMps: 1,
    dwellS: 1800,
    motionW: 0,
    idleW: 0,
    auxW: 10,
  });
  assert.equal(e.energyWh, 10);
});
test('capacity derating applies to both availability and reserve', () => {
  const x = fixture();
  x.capacityFactor = 0.5;
  const r = run(x);
  assert.equal(r.availableWh, 80);
  assert.equal(r.reserveWh, 25);
});
test('zero uncertainty collapses both bounds to nominal energy', () => {
  const x = fixture();
  x.uncertaintyPct = 0;
  const r = run(x);
  assert.equal(r.lowWh, r.nominalWh);
  assert.equal(r.highWh, r.nominalWh);
});
test('100 percent uncertainty has a nonnegative lower bound', () => {
  const x = fixture();
  x.uncertaintyPct = 100;
  const r = run(x);
  assert.equal(r.lowWh, 0);
  assert.equal(r.highWh, 2 * r.nominalWh);
});
test('longer dwell monotonically increases energy when idle load is positive', () => {
  const x = fixture();
  const initial = run(x);
  x.segments[1].dwellS += 3600;
  assert.equal(run(x).nominalWh - initial.nominalWh, 75);
});
test('doubling traversal speed halves motion time under this constant-power model', () => {
  const x = fixture();
  x.segments.forEach((s) => (s.speedMps *= 2));
  assert.equal(run(x).nominalWh, 19);
});
test('zero available energy reports a capacity deficit', () => {
  const x = fixture();
  x.stateOfChargePct = 0;
  const r = run(x);
  assert.equal(r.feasibleWithinAssumptions, false);
  assert.ok(r.findings.some((f) => f.code === 'CAPACITY_DEFICIT'));
});
test('starting below reserve is reported separately', () => {
  const x = fixture();
  x.stateOfChargePct = 10;
  assert.ok(run(x).findings.some((f) => f.code === 'BELOW_INITIAL_RESERVE'));
});
test('zero-length return remains explicit and valid', () => {
  const x = fixture();
  x.segments.at(-1).distanceM = 0;
  assert.equal(run(x).returnHighWh, 0);
});
test('missing return segment is rejected', () => {
  const x = fixture();
  x.segments.pop();
  assert.throws(() => run(x), { code: 'RETURN_POSITION' });
});
test('return segments before the end are rejected', () => {
  const x = fixture();
  x.segments[0].phase = 'return';
  assert.throws(() => run(x), { code: 'RETURN_POSITION' });
});
test('zero traversal speed is rejected before division', () => {
  const x = fixture();
  x.segments[0].speedMps = 0;
  assert.throws(() => run(x), { code: 'NUMBER' });
});
test('negative power is rejected', () => {
  const x = fixture();
  x.segments[0].auxW = -1;
  assert.throws(() => run(x), { code: 'NUMBER' });
});
test('increasing reserves never improves the remaining margin', () => {
  const rows = reserveSweep(fixture(), [0, 10, 20, 30, 40]);
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].marginWh < rows[i - 1].marginWh);
});
test('reserve sweep does not change the supplied scenario', () => {
  const x = fixture(),
    before = structuredClone(x);
  reserveSweep(x);
  assert.deepEqual(x, before);
});
test('reserve boundary with zero energy expenditure is feasible', () => {
  const x = fixture();
  x.stateOfChargePct = x.reservePct;
  x.segments.forEach((s) => {
    s.motionW = 0;
    s.idleW = 0;
    s.auxW = 0;
  });
  assert.equal(run(x).marginWh, 0);
  assert.equal(run(x).feasibleWithinAssumptions, true);
});

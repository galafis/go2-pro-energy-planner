import { svg, label, esc, fmt, text } from './ui.js';
export const interpretation = {
  en: 'Power, capacity derating and uncertainty are supplied assumptions, not measured Go2 PRO specifications. The bounds are deterministic scenarios, not confidence intervals. A feasible result does not establish real endurance or authorize a mission.',
  pt: 'Potência, redução de capacidade e incerteza são hipóteses informadas, não especificações medidas do Go2 PRO. Os limites são cenários determinísticos, não intervalos de confiança. Um resultado viável não comprova autonomia real nem autoriza uma missão.',
};
export const cursorMax = (r) => Math.max(0, r.records.length - 1);
export function render(r, lang, cursor) {
  const rows = r.records.slice(0, 12),
    minimum = Math.min(0, ...rows.map((s) => s.remainingWorstWh)),
    maximum = Math.max(1, r.availableWh, r.reserveWh),
    y = (value) => 250 - ((value - minimum) / (maximum - minimum)) * 200;
  let content = label(
    20,
    25,
    text(
      'Remaining energy after each segment (Wh)',
      'Energia restante após cada segmento (Wh)',
      lang,
    ),
  );
  content += `<line x1="60" x2="730" y1="${y(r.reserveWh)}" y2="${y(r.reserveWh)}" stroke="#a47525" stroke-width="2" stroke-dasharray="5 5"/>${label(725, y(r.reserveWh) - 8, text('Reserve', 'Reserva', lang), 'text-anchor="end"')}`;
  const width = 610 / Math.max(1, rows.length);
  rows.forEach((s, i) => {
    const x = 80 + i * width,
      upperY = y(s.remainingWorstWh),
      normalY = y(s.remainingNominalWh),
      zeroY = y(0);
    content +=
      `<rect x="${x}" y="${Math.min(upperY, zeroY)}" width="${Math.max(4, width * 0.48)}" height="${Math.max(1, Math.abs(zeroY - upperY))}" fill="${s.reserveBreached ? '#b2454a' : 'var(--accent)'}" opacity="${i === cursor ? 1 : 0.65}" rx="3"/><circle cx="${x + width * 0.24}" cy="${normalY}" r="5" fill="#203b4e"/>` +
      label(x + width * 0.24, 279, s.id, 'text-anchor="middle" font-size="10"');
  });
  const s = r.records[cursor];
  return (
    svg(
      content,
      text(
        'Energy reserve and bounded remaining energy',
        'Reserva de energia e limites de energia restante',
        lang,
      ),
    ) +
    `<p class="visual-note"><strong>${esc(s?.id ?? '')}</strong> · ${esc(text('Nominal segment', 'Segmento nominal', lang))}: ${esc(fmt(s?.energyWh, lang))} Wh · ${esc(text('Upper segment', 'Limite superior do segmento', lang))}: ${esc(fmt(s?.highWh, lang))} Wh.<br>${esc(text('Bars: upper-consumption case. Dots: nominal case. Preview: first 12 segments.', 'Barras: cenário de maior consumo. Pontos: cenário nominal. Prévia: primeiros 12 segmentos.', lang))}</p>`
  );
}

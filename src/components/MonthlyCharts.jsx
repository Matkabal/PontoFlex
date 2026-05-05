function MonthlyCharts({ rows, cumulativeSeries }) {
  const width = 760;
  const height = 220;
  const padding = 24;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const maxBar = Math.max(1, ...rows.map((r) => Math.max(r.workedMinutes, r.expectedMinutes)));
  const maxAbsLine = Math.max(1, ...cumulativeSeries.map((p) => Math.abs(p.value)));
  const barStep = rows.length > 0 ? plotWidth / rows.length : plotWidth;

  const linePoints = cumulativeSeries
    .map((point, idx) => {
      const x = padding + idx * barStep + barStep / 2;
      const normalized = (point.value + maxAbsLine) / (maxAbsLine * 2);
      const y = padding + (1 - normalized) * plotHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="card chart-card">
      <h3>Visão gráfica do mês</h3>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico mensal de horas">
        <line x1={padding} y1={padding + plotHeight / 2} x2={padding + plotWidth} y2={padding + plotHeight / 2} className="chart-axis" />
        {rows.map((row, idx) => {
          const x = padding + idx * barStep;
          const expectedH = (row.expectedMinutes / maxBar) * (plotHeight * 0.8);
          const workedH = (row.workedMinutes / maxBar) * (plotHeight * 0.8);
          return (
            <g key={row.date}>
              <rect x={x + 2} y={padding + plotHeight - expectedH} width={Math.max(2, barStep * 0.35)} height={expectedH} className="bar-expected" />
              <rect x={x + 4 + Math.max(2, barStep * 0.35)} y={padding + plotHeight - workedH} width={Math.max(2, barStep * 0.35)} height={workedH} className="bar-worked" />
            </g>
          );
        })}
        {linePoints ? <polyline points={linePoints} className="line-balance" /> : null}
      </svg>
      <p className="helper">Barras: esperado e trabalhado. Linha: saldo acumulado no mês.</p>
    </section>
  );
}

export default MonthlyCharts;

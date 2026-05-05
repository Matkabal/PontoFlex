import { formatMinutesToHHMM, formatWorkedMinutes } from "../utils/time";

function TodaySummary({ workedMinutes, expectedMinutes }) {
  const balance = workedMinutes - expectedMinutes;

  return (
    <section className="summary-grid">
      <article className="kpi-card">
        <h3>Trabalhado hoje</h3>
        <strong>{formatWorkedMinutes(workedMinutes)}</strong>
      </article>
      <article className="kpi-card">
        <h3>Esperado hoje</h3>
        <strong>{formatWorkedMinutes(expectedMinutes)}</strong>
      </article>
      <article className="kpi-card">
        <h3>Saldo do dia</h3>
        <strong>{formatMinutesToHHMM(balance)}</strong>
      </article>
    </section>
  );
}

export default TodaySummary;

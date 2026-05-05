import { formatMinutesToHHMM, formatWorkedMinutes } from "../utils/time";

function TodaySummary({ workedMinutes, expectedMinutes }) {
  const balance = workedMinutes - expectedMinutes;

  return (
    <section className="card summary-grid">
      <div>
        <h3>Trabalhado hoje</h3>
        <strong>{formatWorkedMinutes(workedMinutes)}</strong>
      </div>
      <div>
        <h3>Esperado hoje</h3>
        <strong>{formatWorkedMinutes(expectedMinutes)}</strong>
      </div>
      <div>
        <h3>Saldo do dia</h3>
        <strong>{formatMinutesToHHMM(balance)}</strong>
      </div>
    </section>
  );
}

export default TodaySummary;

import { useState } from "react";
import { addMonths, format } from "date-fns";
import { useMonthlyReport } from "../hooks/useMonthlyReport";
import { formatMinutesToHHMM, formatWorkedMinutes } from "../utils/time";

function MonthlyReportPage({ settings, holidays }) {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const { rows, totals } = useMonthlyReport(referenceDate, settings, holidays);

  return (
    <section className="page">
      <section className="card month-nav">
        <button onClick={() => setReferenceDate(addMonths(referenceDate, -1))}>Mes anterior</button>
        <h2>{format(referenceDate, "MMMM yyyy")}</h2>
        <button onClick={() => setReferenceDate(addMonths(referenceDate, 1))}>Proximo mes</button>
      </section>

      <section className="card">
        <ul className="report-list">
          {rows.map((item) => (
            <li key={item.date}>
              <span className="date">{item.date}</span>
              <span>Trabalhado: {formatWorkedMinutes(item.workedMinutes)}</span>
              <span>Esperado: {formatWorkedMinutes(item.expectedMinutes)}</span>
              <span className={item.balanceMinutes >= 0 ? "balance-pos" : "balance-neg"}>
                Saldo: {formatMinutesToHHMM(item.balanceMinutes)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card totals">
        <h3>Total do mes</h3>
        <p>Trabalhado: {formatWorkedMinutes(totals.worked)}</p>
        <p>Esperado: {formatWorkedMinutes(totals.expected)}</p>
        <p className={totals.balance >= 0 ? "balance-pos" : "balance-neg"}>
          Saldo: {formatMinutesToHHMM(totals.balance)}
        </p>
      </section>
    </section>
  );
}

export default MonthlyReportPage;

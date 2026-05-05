import { useMemo, useState } from "react";
import { addMonths, format, isSameMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMonthlyReport } from "../hooks/useMonthlyReport";
import { usePunchActions } from "../hooks/usePunchActions";
import { formatMinutesToHHMM, formatWorkedMinutes } from "../utils/time";
import { exportMonthlyCsv } from "../utils/exportCsv";
import MonthlyWorkChart from "../components/MonthlyWorkChart";
import MonthlyOvertimeChart from "../components/MonthlyOvertimeChart";
import ReportFilters from "../components/ReportFilters";
import DayTimeEditor from "../components/DayTimeEditor";

function MonthlyReportPage({ settings, holidays }) {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({ showAllDays: false, includeWeekends: true, includeHolidays: true });
  const [error, setError] = useState("");

  const { rows, filteredRows, totals, workedVsExpectedSeries, dailyBalanceSeries } = useMonthlyReport(referenceDate, settings, holidays, filters);
  const { replacePointsByDate } = usePunchActions();

  const today = new Date();
  const defaultDate = useMemo(() => {
    if (isSameMonth(referenceDate, today)) return format(today, "yyyy-MM-dd");
    return rows[0]?.date || null;
  }, [referenceDate, rows, today]);

  const activeDate = selectedDate || defaultDate;
  const dayDetail = rows.find((r) => r.date === activeDate) || rows[0] || null;

  const dayPoints = useMemo(() => {
    if (!dayDetail) return [];
    const points = [];
    dayDetail.sessions.forEach((session) => {
      points.push({ id: `${session.id}-in`, time: format(new Date(session.start), "HH:mm") });
      if (session.end) points.push({ id: `${session.id}-out`, time: format(new Date(session.end), "HH:mm") });
    });
    return points.sort((a, b) => a.time.localeCompare(b.time));
  }, [dayDetail]);

  const syncDayPoints = async (nextPoints) => {
    if (!activeDate) return;
    try {
      setError("");
      await replacePointsByDate(activeDate, nextPoints);
      setSelectedDate(activeDate);
    } catch (e) {
      setError(e.message || "Erro ao salvar horários do dia.");
    }
  };

  const addPoint = (time) => syncDayPoints([...dayPoints, { id: crypto.randomUUID(), time }]);
  const updatePoint = (id, time) => syncDayPoints(dayPoints.map((item) => (item.id === id ? { ...item, time } : item)));
  const deletePoint = (id) => syncDayPoints(dayPoints.filter((item) => item.id !== id));

  const faltaTotal = Math.max(totals.expected - totals.worked, 0);
  const extraTotal = Math.max(totals.worked - totals.expected, 0);

  return (
    <section className="page">
      <section className="card month-nav">
        <button onClick={() => { setReferenceDate(addMonths(referenceDate, -1)); setSelectedDate(null); }}>Mês anterior</button>
        <h2>{format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR })}</h2>
        <button onClick={() => { setReferenceDate(addMonths(referenceDate, 1)); setSelectedDate(null); }}>Próximo mês</button>
      </section>

      <section className="report-summary-grid">
        <article className="kpi-card"><h3>Trabalhado no mês</h3><strong>{formatWorkedMinutes(totals.worked)}</strong></article>
        <article className="kpi-card"><h3>Esperado no mês</h3><strong>{formatWorkedMinutes(totals.expected)}</strong></article>
        <article className="kpi-card"><h3>Falta no mês</h3><strong>{formatWorkedMinutes(faltaTotal)}</strong></article>
        <article className="kpi-card"><h3>Hora extra no mês</h3><strong>{formatWorkedMinutes(extraTotal)}</strong></article>
        <article className="kpi-card"><h3>Saldo total</h3><strong className={totals.balance >= 0 ? "balance-pos" : "balance-neg"}>{formatMinutesToHHMM(totals.balance)}</strong></article>
      </section>

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onExport={() => exportMonthlyCsv(filteredRows, `relatorio-${format(referenceDate, "yyyy-MM")}.csv`)}
      />

      <MonthlyWorkChart data={workedVsExpectedSeries} />
      <MonthlyOvertimeChart data={dailyBalanceSeries} />

      <section className="card">
        <div className="section-head">
          <h3>Dias no relatório</h3>
          <span>{filteredRows.length} dia(s)</span>
        </div>
        <ul className="report-list monthly-list-selectable">
          {filteredRows.map((item) => (
            <li key={item.date} className={item.date === activeDate ? "selected-day" : ""} onClick={() => setSelectedDate(item.date)}>
              <span className="date">{format(parseISO(item.date), "dd/MM/yyyy")}</span>
              <span>Trabalhado: {formatWorkedMinutes(item.workedMinutes)}</span>
              <span>Esperado: {formatWorkedMinutes(item.expectedMinutes)}</span>
              <span className={item.balanceMinutes >= 0 ? "balance-pos" : "balance-neg"}>Saldo: {formatMinutesToHHMM(item.balanceMinutes)}</span>
            </li>
          ))}
        </ul>
      </section>

      {activeDate ? (
        <section>
          <label className="helper">Selecionar dia:</label>
          <input
            type="date"
            value={activeDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={format(referenceDate, "yyyy-MM-01")}
            max={format(referenceDate, "yyyy-MM-31")}
          />
        </section>
      ) : null}

      {activeDate && dayDetail ? (
        <DayTimeEditor
          selectedDate={activeDate}
          row={dayDetail}
          points={dayPoints}
          onAdd={addPoint}
          onUpdate={updatePoint}
          onDelete={deletePoint}
          error={error}
        />
      ) : null}
    </section>
  );
}

export default MonthlyReportPage;

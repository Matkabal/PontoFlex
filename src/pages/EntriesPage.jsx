import { useRef, useState } from "react";
import { format } from "date-fns";
import { useMonthlyReport } from "../hooks/useMonthlyReport";
import { usePunchActions } from "../hooks/usePunchActions";
import DayTimeEditor from "../components/DayTimeEditor";

function EntriesPage({ settings, holidays }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const lastSavedRef = useRef(null);

  const { rows, reloadReport } = useMonthlyReport(new Date(selectedDate), settings, holidays, {
    showAllDays: true,
    includeWeekends: true,
    includeHolidays: true
  });

  const { replacePointsByDate } = usePunchActions();

  const dayDetail = rows.find((row) => row.date === selectedDate) || {
    date: selectedDate,
    workedMinutes: 0,
    expectedMinutes: 0,
    balanceMinutes: 0,
    sessions: []
  };

  const dayPoints = dayDetail.sessions
    .flatMap((session) => {
      const points = [{ id: `${session.id}-in`, time: format(new Date(session.start), "HH:mm") }];
      if (session.end) points.push({ id: `${session.id}-out`, time: format(new Date(session.end), "HH:mm") });
      return points;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const syncDayPoints = async (nextPoints) => {
    try {
      setError("");
      setStatus("Salvando...");
      await replacePointsByDate(selectedDate, nextPoints);
      await reloadReport();
      lastSavedRef.current = format(new Date(), "HH:mm:ss");
      setStatus(`Salvo com sucesso as ${lastSavedRef.current}.`);
    } catch (e) {
      setError(e.message || "Erro ao salvar horários do dia.");
      setStatus("");
    }
  };

  const addPoint = (time) => syncDayPoints([...dayPoints, { id: crypto.randomUUID(), time }]);
  const updatePoint = (id, time) => syncDayPoints(dayPoints.map((item) => (item.id === id ? { ...item, time } : item)));
  const deletePoint = (id) => syncDayPoints(dayPoints.filter((item) => item.id !== id));

  return (
    <section className="page">
      <section className="card">
        <div className="section-head">
          <h2>Lancamentos manuais</h2>
          <span>Edite fora do relatorio</span>
        </div>
        <label className="helper">Dia para lancar horarios</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        {status ? <p className="helper">{status}</p> : null}
      </section>

      <DayTimeEditor
        selectedDate={selectedDate}
        row={dayDetail}
        points={dayPoints}
        onAdd={addPoint}
        onUpdate={updatePoint}
        onDelete={deletePoint}
        error={error}
      />
    </section>
  );
}

export default EntriesPage;

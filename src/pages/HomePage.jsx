import { useMemo, useState } from "react";
import { format } from "date-fns";
import StatusCard from "../components/StatusCard";
import TodaySummary from "../components/TodaySummary";
import TimePointsEditor from "../components/TimePointsEditor";
import { useTodaySessions } from "../hooks/useTodaySessions";
import { usePunchActions } from "../hooks/usePunchActions";
import { expectedMinutesForDate } from "../utils/rules";
import { minutesBetween } from "../utils/time";

function HomePage({ settings, holidays }) {
  const { sessions, openSession, reloadToday } = useTodaySessions();
  const { replaceTodayFromPoints } = usePunchActions(reloadToday);
  const [error, setError] = useState("");

  const points = useMemo(() => {
    const generated = [];
    sessions.forEach((session) => {
      generated.push({ id: `${session.id}-in`, time: format(new Date(session.start), "HH:mm") });
      if (session.end) {
        generated.push({ id: `${session.id}-out`, time: format(new Date(session.end), "HH:mm") });
      }
    });

    return generated.sort((a, b) => a.time.localeCompare(b.time));
  }, [sessions]);

  const workedMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + minutesBetween(s.start, s.end), 0),
    [sessions]
  );
  const expectedMinutes = expectedMinutesForDate(new Date(), settings, holidays);

  const syncPoints = async (nextPoints) => {
    try {
      setError("");
      await replaceTodayFromPoints(nextPoints);
    } catch (e) {
      setError(e.message || "Erro ao processar horários.");
    }
  };

  const addPoint = (time) => syncPoints([...points, { id: crypto.randomUUID(), time }]);
  const updatePoint = (id, time) => syncPoints(points.map((item) => (item.id === id ? { ...item, time } : item)));
  const deletePoint = (id) => syncPoints(points.filter((item) => item.id !== id));

  return (
    <section className="page">
      <section className="hero-card card">
        <div>
          <h2>{format(new Date(), "dd/MM/yyyy")}</h2>
          <p>Insira seus horários e o PontoFlex calcula automaticamente suas sessões e saldo.</p>
        </div>
        <span className="hero-tag">{openSession ? "Jornada aberta" : "Jornada fechada"}</span>
      </section>

      <div className="home-grid">
        <StatusCard working={Boolean(openSession)} />
        <TodaySummary workedMinutes={workedMinutes} expectedMinutes={expectedMinutes} />
      </div>

      {error ? <p className="error">{error}</p> : null}
      <TimePointsEditor points={points} onAdd={addPoint} onUpdate={updatePoint} onDelete={deletePoint} />
    </section>
  );
}

export default HomePage;

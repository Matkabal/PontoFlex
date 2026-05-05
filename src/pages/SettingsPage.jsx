import { useEffect, useMemo, useState } from "react";
import HolidayForm from "../components/HolidayForm";

function SettingsPage({
  settings,
  holidays,
  holidaySyncStatus,
  onSaveSettings,
  onAddHoliday,
  onDeleteHoliday
}) {
  const [weeklyHours, setWeeklyHours] = useState({});

  useEffect(() => {
    const next = {};
    for (let day = 0; day < 7; day += 1) {
      next[day] = Number((settings.weeklyMinutes?.[day] || 0) / 60);
    }
    setWeeklyHours(next);
  }, [settings]);

  const labels = useMemo(() => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"], []);

  const setDayHours = (day, value) => setWeeklyHours((prev) => ({ ...prev, [day]: value }));
  const toggleDay = (day) => setWeeklyHours((prev) => ({ ...prev, [day]: prev[day] > 0 ? 0 : 8 }));

  const save = () => {
    const weeklyMinutes = {};
    for (let day = 0; day < 7; day += 1) {
      const value = Number(weeklyHours[day] || 0);
      weeklyMinutes[day] = value > 0 ? Math.round(value * 60) : 0;
    }
    onSaveSettings({ weeklyMinutes });
  };

  const syncLabel = {
    idle: "Aguardando sincronizacao de feriados",
    syncing: "Sincronizando feriados do ano atual...",
    ready: "Feriados do ano atual carregados",
    error: "Nao foi possivel sincronizar agora"
  }[holidaySyncStatus || "idle"];

  return (
    <section className="page">
      <section className="card">
        <h2>Jornada por dia da semana</h2>
        <p className="helper">Defina horas diferentes por dia, ex.: quinta 8h e sexta 9h.</p>
        <div className="weekday-grid">
          {labels.map((label, day) => {
            const active = Number(weeklyHours[day] || 0) > 0;
            return (
              <div key={label} className="weekday-row">
                <button className={active ? "active" : ""} onClick={() => toggleDay(day)}>
                  {label}
                </button>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={weeklyHours[day] ?? 0}
                  onChange={(e) => setDayHours(day, e.target.value)}
                />
                <span>h</span>
              </div>
            );
          })}
        </div>
        <button className="btn-primary" onClick={save}>Salvar configuracoes</button>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Feriados</h2>
          <span className={`sync-badge ${holidaySyncStatus}`}>{syncLabel}</span>
        </div>

        <HolidayForm onAdd={onAddHoliday} />

        <ul className="holiday-list">
          {holidays.map((holiday) => (
            <li key={holiday.id}>
              <span>{holiday.date} - {holiday.name}</span>
              <small>{holiday.source === "api" ? "API" : "Manual"}</small>
              <button className="danger" onClick={() => onDeleteHoliday(holiday.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default SettingsPage;

import { useState } from "react";

function TimePointsEditor({ points, onAdd, onUpdate, onDelete }) {
  const [newTime, setNewTime] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!newTime) return;
    onAdd(newTime);
    setNewTime("");
  };

  return (
    <section className="card">
      <h2>Lancamentos do dia</h2>
      <form className="time-form" onSubmit={submit}>
        <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
        <button type="submit">Adicionar horario</button>
      </form>
      <ul className="point-list">
        {points.map((point, index) => (
          <li key={point.id}>
            <div>
              <strong>{index % 2 === 0 ? "Entrada" : "Saida"}</strong>
              <span>{point.time}</span>
            </div>
            <input
              type="time"
              value={point.time}
              onChange={(e) => onUpdate(point.id, e.target.value)}
            />
            <button className="danger" onClick={() => onDelete(point.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TimePointsEditor;

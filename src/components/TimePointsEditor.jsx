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
      <div className="section-head">
        <h2>Lancamentos do dia</h2>
        <span>{points.length} horario(s)</span>
      </div>

      <form className="time-form" onSubmit={submit}>
        <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
        <button type="submit" className="btn-primary">Adicionar</button>
      </form>

      <ul className="point-list">
        {points.map((point, index) => (
          <li key={point.id} className="point-item">
            <div className="point-meta">
              <strong>{index % 2 === 0 ? "Entrada" : "Saida"}</strong>
              <span>{point.time}</span>
            </div>
            <div className="point-actions">
              <input type="time" value={point.time} onChange={(e) => onUpdate(point.id, e.target.value)} />
              <button className="danger" onClick={() => onDelete(point.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TimePointsEditor;

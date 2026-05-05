import { useState } from "react";
import { formatDateTime } from "../utils/time";

function DaySessionsList({ sessions, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");

  const startEdit = (session) => {
    setEditingId(session.id);
    setStartValue(session.start.slice(11, 16));
    setEndValue(session.end ? session.end.slice(11, 16) : "");
  };

  const save = (session) => {
    const datePart = session.start.slice(0, 10);
    const nextStart = `${datePart}T${startValue}:00`;
    const nextEnd = endValue ? `${datePart}T${endValue}:00` : null;
    onUpdate(session.id, {
      start: new Date(nextStart).toISOString(),
      end: nextEnd ? new Date(nextEnd).toISOString() : null
    });
    setEditingId(null);
  };

  return (
    <section className="card">
      <h2>Historico do dia</h2>
      <ul className="session-list">
        {sessions.map((session) => (
          <li key={session.id}>
            {editingId === session.id ? (
              <>
                <input type="time" value={startValue} onChange={(e) => setStartValue(e.target.value)} />
                <input type="time" value={endValue} onChange={(e) => setEndValue(e.target.value)} />
                <button onClick={() => save(session)}>Salvar</button>
              </>
            ) : (
              <>
                <span>
                  {formatDateTime(session.start)} - {session.end ? formatDateTime(session.end) : "aberta"}
                </span>
                <button onClick={() => startEdit(session)}>Editar</button>
              </>
            )}
            <button className="danger" onClick={() => onDelete(session.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DaySessionsList;

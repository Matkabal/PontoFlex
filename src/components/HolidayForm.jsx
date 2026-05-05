import { useState } from "react";

function HolidayForm({ onAdd }) {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!date || !name.trim()) return;
    onAdd({ date, name: name.trim() });
    setDate("");
    setName("");
  };

  return (
    <form className="holiday-form" onSubmit={submit}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do feriado" required />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default HolidayForm;

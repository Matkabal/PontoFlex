import { useState } from "react";

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={submit} className="todo-form">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Nova tarefa"
        aria-label="Nome da tarefa"
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TodoForm;

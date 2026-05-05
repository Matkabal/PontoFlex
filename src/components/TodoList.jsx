function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return <p className="empty-state">Nenhuma tarefa ainda. Comece adicionando a primeira.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? "done" : ""}>
          <label>
            <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
            <span>{todo.title}</span>
          </label>
          <button className="danger" onClick={() => onDelete(todo.id)} aria-label={`Excluir ${todo.title}`}>
            Excluir
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;

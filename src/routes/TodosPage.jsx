import { useMemo } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { useLocalStorage } from "../hooks/useLocalStorage";

function TodosPage() {
  const [todos, setTodos] = useLocalStorage("pwa.todos.v1", []);

  const pendingCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);

  const addTodo = (title) => {
    setTodos((current) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const clearDone = () => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Minhas tarefas</h2>
        <p>{pendingCount} pendente(s)</p>
      </div>

      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      <button className="ghost" onClick={clearDone} disabled={!todos.some((todo) => todo.completed)}>
        Limpar concluidas
      </button>
    </section>
  );
}

export default TodosPage;

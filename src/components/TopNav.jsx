function TopNav({ current, onChange, onToggleMenu }) {
  return (
    <nav className="top-nav-wrap" aria-label="Navegacao principal">
      <div className="top-nav">
        <button className={current === "home" ? "active" : ""} onClick={() => onChange("home")}>Inicio</button>
        <button className={current === "entries" ? "active" : ""} onClick={() => onChange("entries")}>Lancamentos</button>
        <button className={current === "report" ? "active" : ""} onClick={() => onChange("report")}>Relatorio</button>
      </div>
      <button className="menu-trigger" onClick={onToggleMenu} aria-label="Abrir menu">?</button>
    </nav>
  );
}

export default TopNav;

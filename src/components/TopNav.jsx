function TopNav({ current, onChange, onToggleMenu }) {
  return (
    <nav className="top-nav-wrap" aria-label="Navegação principal">
      <div className="top-nav">
        <button className={current === "home" ? "active" : ""} onClick={() => onChange("home")}>Início</button>
        <button className={current === "report" ? "active" : ""} onClick={() => onChange("report")}>Relatório</button>
      </div>
      <button className="menu-trigger" onClick={onToggleMenu} aria-label="Abrir menu">☰</button>
    </nav>
  );
}

export default TopNav;

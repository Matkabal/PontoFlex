function TopNav({ current, onChange }) {
  return (
    <nav className="top-nav">
      <button className={current === "home" ? "active" : ""} onClick={() => onChange("home")}>Início</button>
      <button className={current === "report" ? "active" : ""} onClick={() => onChange("report")}>Relatório</button>
      <button className={current === "settings" ? "active" : ""} onClick={() => onChange("settings")}>Configurações</button>
    </nav>
  );
}

export default TopNav;

function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav">
      <button className={current === "home" ? "active" : ""} onClick={() => onChange("home")}>Inicio</button>
      <button className={current === "report" ? "active" : ""} onClick={() => onChange("report")}>Relatorio</button>
      <button className={current === "settings" ? "active" : ""} onClick={() => onChange("settings")}>Configuracoes</button>
    </nav>
  );
}

export default BottomNav;

import { useEffect, useState } from "react";
import TopNav from "./components/TopNav";
import AppMenuDrawer from "./components/AppMenuDrawer";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import MonthlyReportPage from "./pages/MonthlyReportPage";
import EntriesPage from "./pages/EntriesPage";
import HelpPage from "./pages/HelpPage";
import { useSettings } from "./hooks/useSettings";

function App() {
  const [tab, setTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState("menu");
  const { settings, holidays, holidaySyncStatus, saveSettings, addHoliday, deleteHoliday } = useSettings();

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMenuView("menu");
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuView("menu");
  };

  const openSettings = () => {
    setTab("settings");
    closeMenu();
  };

  const openHelp = () => {
    setTab("help");
    closeMenu();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand-wrap">
          <h1>PontoFlex</h1>
          <p>Gestao inteligente de jornada pessoal</p>
        </div>
        <TopNav current={tab} onChange={setTab} onToggleMenu={() => setMenuOpen(true)} />
      </header>

      <main>
        {tab === "home" ? <HomePage settings={settings} holidays={holidays} /> : null}
        {tab === "entries" ? <EntriesPage settings={settings} holidays={holidays} /> : null}
        {tab === "report" ? <MonthlyReportPage settings={settings} holidays={holidays} /> : null}
        {tab === "settings" ? (
          <SettingsPage
            settings={settings}
            holidays={holidays}
            holidaySyncStatus={holidaySyncStatus}
            onSaveSettings={saveSettings}
            onAddHoliday={addHoliday}
            onDeleteHoliday={deleteHoliday}
          />
        ) : null}
        {tab === "help" ? <HelpPage /> : null}
      </main>

      <footer className="app-footer">
        <small>
          © {new Date().getFullYear()} PontoFlex. Todos os direitos reservados. Reproducao, copia ou distribuicao sem autorizacao e proibida.
        </small>
      </footer>

      <AppMenuDrawer
        open={menuOpen}
        view={menuView}
        onClose={closeMenu}
        onOpenSettings={openSettings}
        onOpenHelp={openHelp}
        onOpenAbout={() => setMenuView("about")}
        onBackToMenu={() => setMenuView("menu")}
      />
    </div>
  );
}

export default App;

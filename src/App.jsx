import { useState } from "react";
import TopNav from "./components/TopNav";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import MonthlyReportPage from "./pages/MonthlyReportPage";
import { useSettings } from "./hooks/useSettings";

function App() {
  const [tab, setTab] = useState("home");
  const { settings, holidays, holidaySyncStatus, saveSettings, addHoliday, deleteHoliday } = useSettings();

  return (
    <div className="app">
      <header className="header">
        <div className="brand-wrap">
          <h1>PontoFlex</h1>
          <p>Gestão inteligente de jornada pessoal</p>
        </div>
        <TopNav current={tab} onChange={setTab} />
      </header>

      <main>
        {tab === "home" ? <HomePage settings={settings} holidays={holidays} /> : null}
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
      </main>
    </div>
  );
}

export default App;

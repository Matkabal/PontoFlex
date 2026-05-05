function AppMenuDrawer({ open, view, onClose, onOpenAbout, onBackToMenu, onOpenSettings, onOpenHelp }) {
  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`app-drawer ${open ? "open" : ""}`} role="dialog" aria-label="Menu do aplicativo">
        {view === "menu" ? (
          <>
            <div className="drawer-head">
              <h3>Menu</h3>
              <button className="drawer-close" onClick={onClose} aria-label="Fechar menu">×</button>
            </div>
            <div className="drawer-links">
              <button onClick={onOpenSettings}>Configurações</button>
              <button onClick={onOpenHelp}>Ajuda</button>
              <button onClick={onOpenAbout}>Sobre</button>
            </div>
          </>
        ) : (
          <>
            <div className="drawer-head">
              <button className="drawer-back" onClick={onBackToMenu}>Voltar</button>
              <button className="drawer-close" onClick={onClose} aria-label="Fechar menu">×</button>
            </div>
            <section className="drawer-about">
              <h3>Sobre o PontoFlex</h3>
              <p>Aplicativo de controle de jornada pessoal com funcionamento offline.</p>
              <ul>
                <li>Versão: 1.0.0</li>
                <li>Armazenamento local no dispositivo</li>
                <li>Sem envio automático para servidor</li>
                <li>Stack: React, Vite, Dexie, date-fns, PWA</li>
              </ul>
            </section>
          </>
        )}
      </aside>
    </>
  );
}

export default AppMenuDrawer;

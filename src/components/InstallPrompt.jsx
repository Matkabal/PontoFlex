import { useEffect, useState } from "react";

function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    const listener = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };

    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  if (!promptEvent) {
    return null;
  }

  const install = async () => {
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  return (
    <section className="install-banner">
      <p>Instale este app para acesso rapido.</p>
      <button onClick={install}>Instalar</button>
    </section>
  );
}

export default InstallPrompt;

import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [registration, setRegistration] = useState(null);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;

    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        setRegistration(reg);

        if (reg.waiting) {
          setUpdateReady(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => {
        // Ignore registration errors for unsupported contexts.
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  const applyUpdate = () => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };

  return { updateReady, applyUpdate };
}

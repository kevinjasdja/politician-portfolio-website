// Service Worker Registration
// Only registers in production to avoid interfering with development

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Only register in production
      if (import.meta.env.PROD) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "✅ Service Worker registered successfully:",
              registration.scope
            );

            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    console.log("🔄 New content available, please refresh.");
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error("❌ Service Worker registration failed:", error);
          });
      } else {
        console.log(
          "🚧 Service Worker registration skipped in development mode"
        );
      }
    });
  } else {
    console.warn("⚠️ Service Workers are not supported in this browser");
  }
}

// Optional: Unregister service worker (useful for debugging)
export function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log("Service Worker unregistered");
      })
      .catch((error) => {
        console.error("Error unregistering Service Worker:", error);
      });
  }
}

// Progressive Web App (PWA) Service Worker Registration & Offline Caching

export function registerServiceWorker(onSuccess?: () => void, onUpdate?: () => void) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[PWA] Service Worker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('[PWA] New content is available; please refresh.');
                  if (onUpdate) onUpdate();
                } else {
                  // Content is cached for offline use
                  console.log('[PWA] Content is cached for offline use.');
                  if (onSuccess) onSuccess();
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[PWA] Error during service worker registration:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Add this to your app.js or run in Safari console
function debugServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('Service Worker Registrations:', registrations.length);
      registrations.forEach((reg, i) => {
        console.log(`SW ${i}:`, {
          scope: reg.scope,
          state: reg.active?.state,
          scriptURL: reg.active?.scriptURL
        });
      });
    });

    // Check cache
    caches.keys().then(cacheNames => {
      console.log('Available caches:', cacheNames);
      cacheNames.forEach(name => {
        caches.open(name).then(cache => {
          cache.keys().then(keys => {
            console.log(`Cache "${name}" contains:`, keys.map(req => req.url));
          });
        });
      });
    });
  } else {
    console.log('Service Workers not supported');
  }
}

// Run the debug function
debugServiceWorker();
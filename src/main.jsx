import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA
const isNativeShell = window.Capacitor?.isNativePlatform?.() === true;

if ('serviceWorker' in navigator && import.meta.env.PROD && !isNativeShell) {
  window.addEventListener('load', () => {
    const appBaseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
    const appWorkerUrl = new URL('sw.js', appBaseUrl);
    const unregisterLegacyRootWorker = appBaseUrl.pathname === '/'
      ? Promise.resolve()
      : navigator.serviceWorker.getRegistrations().then((registrations) => {
        const rootWorkerUrl = new URL('/sw.js', window.location.origin).href;
        const legacyRootRegistration = registrations.find((registration) =>
          registration.scope === new URL('/', window.location.origin).href &&
          [registration.active, registration.waiting, registration.installing]
            .some(worker => worker?.scriptURL === rootWorkerUrl)
        );
        return legacyRootRegistration?.unregister();
      });

    unregisterLegacyRootWorker
      .then(() => navigator.serviceWorker.register(appWorkerUrl, { scope: appBaseUrl.pathname }))
      .then((reg) => console.log('Service Worker registered with scope:', reg.scope))
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
}
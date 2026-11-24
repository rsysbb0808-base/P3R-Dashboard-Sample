(() => {
  const updateConnectionStatus = () => {
    const status = document.getElementById('connectionStatus');
    if (!status) return;
    status.textContent = navigator.onLine ? 'オンライン・記録はこの端末内' : 'オフライン・端末内の保存データで利用中';
    status.classList.toggle('offline', !navigator.onLine);
  };
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  updateConnectionStatus();
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) return;
  const workerUrl = new URL('../sw.js', scriptUrl);
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(workerUrl.href).catch(() => {
      // The site remains usable online if offline caching is unavailable.
    });
  });
})();

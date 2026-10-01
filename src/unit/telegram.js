/**
 * Telegram Mini App SDK integration
 */

let isInitialized = false;

const applyTelegramSettings = (tg) => {
  if (!tg || isInitialized) {
    return;
  }
  isInitialized = true;

  const supports = (minVersion) => {
    if (typeof tg.isVersionAtLeast === 'function') {
      try {
        return tg.isVersionAtLeast(minVersion);
      } catch (e) {
        return false;
      }
    }
    // Fallback: compare version strings manually if tg.version is provided
    if (typeof tg.version === 'string') {
      const vCurrent = tg.version.split('.').map(n => parseInt(n, 10));
      const vMin = minVersion.split('.').map(n => parseInt(n, 10));
      const len = Math.max(vCurrent.length, vMin.length);
      for (let i = 0; i < len; i++) {
        const c = vCurrent[i] || 0;
        const m = vMin[i] || 0;
        if (c > m) return true;
        if (c < m) return false;
      }
      return true;
    }
    return false;
  };

  // 1. tg.ready() - supported in 6.0+
  if (typeof tg.ready === 'function') {
    try {
      tg.ready();
    } catch (e) {
      console.warn('tg.ready failed', e);
    }
  }

  // 2. tg.expand() - supported in 6.0+
  if (typeof tg.expand === 'function') {
    try {
      tg.expand();
    } catch (e) {
      console.warn('tg.expand failed', e);
    }
  }

  // 3. tg.requestFullscreen() - supported in 8.0+
  if (supports('8.0') && typeof tg.requestFullscreen === 'function') {
    try {
      tg.requestFullscreen();
    } catch (e) {
      console.warn('tg.requestFullscreen failed', e);
    }
  }

  // 4. tg.enableClosingConfirmation() - supported in 6.2+
  if (supports('6.2') && typeof tg.enableClosingConfirmation === 'function') {
    try {
      tg.enableClosingConfirmation();
    } catch (e) {
      console.warn('tg.enableClosingConfirmation failed', e);
    }
  }

  // 5. tg.disableVerticalSwipes() - supported in 7.7+
  if (supports('7.7') && typeof tg.disableVerticalSwipes === 'function') {
    try {
      tg.disableVerticalSwipes();
    } catch (e) {
      console.warn('tg.disableVerticalSwipes failed', e);
    }
  }

  // 6. tg.lockOrientation() - supported in 8.0+
  if (supports('8.0') && typeof tg.lockOrientation === 'function') {
    try {
      tg.lockOrientation();
    } catch (e) {
      console.warn('tg.lockOrientation failed', e);
    }
  }

  // 7. Theme colors matching the yellow app theme (#efcc19) - supported in 6.1+
  if (supports('6.1')) {
    if (typeof tg.setHeaderColor === 'function') {
      try {
        tg.setHeaderColor('#efcc19');
      } catch (e) {
        console.warn('tg.setHeaderColor failed', e);
      }
    }
    if (typeof tg.setBackgroundColor === 'function') {
      try {
        tg.setBackgroundColor('#efcc19');
      } catch (e) {
        console.warn('tg.setBackgroundColor failed', e);
      }
    }
  }
};

export const initTelegramWebApp = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    applyTelegramSettings(tg);
    return tg;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    const currentTg = window.Telegram && window.Telegram.WebApp;
    if (currentTg) {
      applyTelegramSettings(currentTg);
      clearInterval(timer);
    } else if (attempts >= 30) {
      clearInterval(timer);
    }
  }, 100);

  return null;
};

export default initTelegramWebApp;


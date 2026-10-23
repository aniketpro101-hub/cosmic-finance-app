/**
 * Cosmic Finance — PWA Install Prompt & Real-Time Push Notification Engine
 * Handles App install banner, service worker registration, and push notification sync
 */

(function() {
  'use strict';

  let deferredInstallPrompt = null;
  const LAST_SEEN_NOTIF_KEY = 'cf_last_seen_notif_id';

  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully with scope:', reg.scope);
          initPushNotificationSync(reg);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar on mobile Chrome
    e.preventDefault();
    deferredInstallPrompt = e;

    // Don't show if user dismissed recently
    const dismissedTime = localStorage.getItem('cf_pwa_dismissed_time');
    if (dismissedTime && (Date.now() - parseInt(dismissedTime, 10)) < (24 * 60 * 60 * 1000)) {
      return;
    }

    // Show custom App Install Banner after small initial reading delay
    setTimeout(() => {
      showAppInstallBanner();
    }, 2500);
  });

  // 3. Render Custom Floating Cosmic App Install Banner
  function showAppInstallBanner() {
    if (document.getElementById('cosmicAppInstallBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'cosmicAppInstallBanner';
    banner.className = 'cosmic-app-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner-glow"></div>
      <div class="pwa-banner-content">
        <div class="pwa-banner-icon">
          <img src="/images/dr_ashish_patni_executive.png" alt="Cosmic Finance App Icon" class="pwa-app-icon-img">
        </div>
        <div class="pwa-banner-text">
          <div class="pwa-banner-title">
            <span>Install Cosmic Finance App</span>
            <span class="pwa-badge">VIP</span>
          </div>
          <p class="pwa-banner-desc">Add to your Home Screen for instant planetary market alerts &amp; live sidereal telemetry.</p>
        </div>
        <div class="pwa-banner-actions">
          <button type="button" class="btn-pwa-install" id="btnPwaInstallAction">
            <span>📲 Install App</span>
          </button>
          <button type="button" class="btn-pwa-close" id="btnPwaCloseAction" aria-label="Dismiss">&times;</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    setTimeout(() => {
      banner.classList.add('visible');
    }, 50);

    // Handle Install Click
    const installBtn = document.getElementById('btnPwaInstallAction');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) {
          // Fallback guidance for iOS Safari or standalone desktop
          alert('To install Cosmic Finance on your device:\n\n• On iOS (Safari): Tap the Share button (square with arrow) and select "Add to Home Screen".\n• On Android (Chrome): Tap the menu dots (⋮) and select "Install app".');
          dismissInstallBanner(false);
          return;
        }

        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log('[PWA] User response to install prompt:', outcome);
        deferredInstallPrompt = null;
        dismissInstallBanner(true);
      });
    }

    // Handle Dismiss Click
    const closeBtn = document.getElementById('btnPwaCloseAction');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dismissInstallBanner(false);
      });
    }
  }

  function dismissInstallBanner(isInstalled) {
    const banner = document.getElementById('cosmicAppInstallBanner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 400);
    }
    if (!isInstalled) {
      localStorage.setItem('cf_pwa_dismissed_time', Date.now().toString());
    }
  }

  // Also listen for appinstalled event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Cosmic Finance App was successfully installed!');
    deferredInstallPrompt = null;
    dismissInstallBanner(true);
  });

  // 4. Push Notification Permission & Real-Time Sync
  function initPushNotificationSync(swRegistration) {
    // Check if notifications are supported
    if (!('Notification' in window)) return;

    // Periodic check for new broadcasted admin updates (every 25 seconds)
    pollForAdminPushUpdates(swRegistration);
    setInterval(() => {
      pollForAdminPushUpdates(swRegistration);
    }, 25000);

    // Add floating "🔔 Enable Alerts" button if permission is default
    if (Notification.permission === 'default') {
      setupFloatingPushBellPrompt(swRegistration);
    }
  }

  // Request Notification Permission & Subscribe
  async function requestPushPermission(swRegistration) {
    if (!('Notification' in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showCosmicToast('✨ Push Notifications Active!', 'You will receive instant alerts whenever Dr. Ashish Patni publishes a new market outlook.');
        
        // Hide bell prompt if open
        const bell = document.getElementById('cosmicFloatingPushBell');
        if (bell) bell.style.display = 'none';

        // Register dummy or real subscription with backend
        fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: {
              endpoint: 'browser_active_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
              grantedAt: new Date().toISOString()
            }
          })
        }).catch(() => {});

        return true;
      }
    } catch (e) {
      console.warn('Push permission error:', e);
    }
    return false;
  }

  // Poll backend for new admin updates and trigger notification
  async function pollForAdminPushUpdates(swRegistration) {
    try {
      const res = await fetch('/api/push/latest', { cache: 'no-cache' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.notification && data.notification.id) {
        const notif = data.notification;
        const lastSeenId = parseInt(localStorage.getItem(LAST_SEEN_NOTIF_KEY) || '0', 10);

        // If this is a fresh new notification from Admin
        if (notif.id > lastSeenId) {
          // If this is the very first visit, record current ID without spamming
          if (lastSeenId === 0) {
            localStorage.setItem(LAST_SEEN_NOTIF_KEY, notif.id.toString());
            return;
          }

          localStorage.setItem(LAST_SEEN_NOTIF_KEY, notif.id.toString());

          // Trigger native notification if permission granted
          if (Notification.permission === 'granted') {
            if (swRegistration && swRegistration.showNotification) {
              swRegistration.showNotification(notif.title, {
                body: notif.body,
                icon: '/images/dr_ashish_patni_executive.png',
                badge: '/images/dr_ashish_patni_executive.png',
                data: { url: notif.url || '/' }
              });
            } else {
              new Notification(notif.title, {
                body: notif.body,
                icon: '/images/dr_ashish_patni_executive.png'
              });
            }
          }

          // Also show rich in-app toast for active users
          showCosmicToast(notif.title, notif.body, notif.url);
        }
      }
    } catch (e) {
      // Ignore background network dropouts
    }
  }

  // Floating Push Notification Prompt Widget
  function setupFloatingPushBellPrompt(swRegistration) {
    if (document.getElementById('cosmicFloatingPushBell')) return;

    const bellBtn = document.createElement('button');
    bellBtn.id = 'cosmicFloatingPushBell';
    bellBtn.className = 'cosmic-floating-push-bell';
    bellBtn.title = 'Enable Instant Planetary Market Alerts';
    bellBtn.innerHTML = `
      <span class="bell-icon">🔔</span>
      <span class="bell-text">Get Market Alerts</span>
    `;

    bellBtn.addEventListener('click', () => {
      requestPushPermission(swRegistration);
    });

    document.body.appendChild(bellBtn);
  }

  // Toast Notification Helper
  function showCosmicToast(title, body, targetUrl = null) {
    const existing = document.getElementById('cosmicLiveToast');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const toast = document.createElement('div');
    toast.id = 'cosmicLiveToast';
    toast.className = 'cosmic-live-toast';
    toast.innerHTML = `
      <div class="toast-indicator"></div>
      <div class="toast-body">
        <strong>${title}</strong>
        <p>${body}</p>
        ${targetUrl ? `<a href="${targetUrl}" class="toast-link">View Analysis &rarr;</a>` : ''}
      </div>
      <button type="button" class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('active'); }, 50);
    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
      }
    }, 7000);
  }

  // Expose global helper for testing
  window.triggerTestPushNotification = function() {
    fetch('/api/push/send-test', { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        showCosmicToast(d.title, d.body, d.url);
      });
  };

})();

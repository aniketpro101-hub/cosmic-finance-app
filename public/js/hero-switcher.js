/**
 * Cosmic Finance — 3-Vision Design Switcher Controller
 * Smoothly activates and transitions between Design 1, Design 2, and Design 3.
 */

(function () {
  function initSwitcher() {
    const switcherBar = document.getElementById('designSwitcherBar');
    const buttons = document.querySelectorAll('.switcher-btn');
    const variants = {
      '1': document.getElementById('heroVariant1'),
      '2': document.getElementById('heroVariant2'),
      '3': document.getElementById('heroVariant3')
    };

    // Read initial design from URL param (?design=X) or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let activeDesign = urlParams.get('design') || localStorage.getItem('cosmic_hero_design') || '1';

    if (!variants[activeDesign]) {
      activeDesign = '1';
    }

    function setActiveDesign(designId) {
      activeDesign = String(designId);
      localStorage.setItem('cosmic_hero_design', activeDesign);

      // Update URL without reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('design', activeDesign);
      window.history.replaceState({}, '', newUrl.toString());

      // Update active button state
      buttons.forEach(btn => {
        if (btn.getAttribute('data-design') === activeDesign) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update variant containers
      Object.keys(variants).forEach(key => {
        const el = variants[key];
        if (el) {
          if (key === activeDesign) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      });

      // Trigger resize on window to recalculate active canvas dimensions
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }

    // Attach click events to buttons
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const designId = btn.getAttribute('data-design');
        setActiveDesign(designId);
      });
    });

    // Initialize initial state
    setActiveDesign(activeDesign);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitcher);
  } else {
    initSwitcher();
  }
})();

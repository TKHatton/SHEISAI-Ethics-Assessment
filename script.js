// Accessibility-focused interactions

// FAQ accordion
function setupAccordion() {
  const buttons = document.querySelectorAll('.accordion-button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (!panel) return;

      // Close all others for single-open behavior (optional)
      document.querySelectorAll('.accordion-button[aria-expanded="true"]').forEach((openBtn) => {
        if (openBtn !== btn) {
          openBtn.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(openBtn.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });

    // Keyboard: Enter/Space activates; Up/Down to navigate between headers
    btn.addEventListener('keydown', (e) => {
      const key = e.key;
      const items = Array.from(document.querySelectorAll('.accordion-button'));
      const i = items.indexOf(btn);
      if (key === 'ArrowDown') {
        e.preventDefault();
        items[(i + 1) % items.length].focus();
      } else if (key === 'ArrowUp') {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length].focus();
      }
    });
  });
}

// Improve focus styles on keyboard nav only
function setupFocusVisible() {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }
  function handleMouseDownOnce() {
    document.documentElement.classList.remove('user-tabbing');
    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleFirstTab);
  }
  window.addEventListener('keydown', handleFirstTab);
}

// Defer heavy background images until after first paint (progressive enhancement)
function setupHeroImageFallback() {
  const hero = document.querySelector('.hero__media');
  if (!hero) return;
  const test = new Image();
  test.src = 'assets/hero.jpg';
  test.onload = () => { /* background already set via CSS */ };
  test.onerror = () => {
    // Fallback to gradient-only if image missing
    hero.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)';
  };
}

document.addEventListener('DOMContentLoaded', () => {
  setupAccordion();
  setupFocusVisible();
  setupHeroImageFallback();
});

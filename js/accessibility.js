const ACCESSIBILITY_STORAGE_KEY = 'govbr-prototipo-a11y';

function getAccessibilityPrefs() {
  try {
    return JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveAccessibilityPrefs(prefs) {
  localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(prefs));
}

function applyAccessibilityPrefs(prefs) {
  document.body.classList.toggle('large-font', Boolean(prefs.largeFont));
  document.body.classList.toggle('contrast', Boolean(prefs.contrast));
  document.body.classList.toggle('dark', Boolean(prefs.dark));

  const fontBtn = document.getElementById('fontBtn');
  const contrastBtn = document.getElementById('contrastBtn');
  const themeBtn = document.getElementById('themeBtn');

  fontBtn?.setAttribute('aria-pressed', prefs.largeFont ? 'true' : 'false');
  contrastBtn?.setAttribute('aria-pressed', prefs.contrast ? 'true' : 'false');
  themeBtn?.setAttribute('aria-pressed', prefs.dark ? 'true' : 'false');
  if (themeBtn) themeBtn.textContent = prefs.dark ? 'Modo claro' : 'Modo escuro';
}

function initAccessibility() {
  const fontBtn = document.getElementById('fontBtn');
  const contrastBtn = document.getElementById('contrastBtn');
  const themeBtn = document.getElementById('themeBtn');
  const prefs = getAccessibilityPrefs();

  applyAccessibilityPrefs(prefs);

  fontBtn?.addEventListener('click', () => {
    const nextPrefs = { ...getAccessibilityPrefs(), largeFont: !document.body.classList.contains('large-font') };
    saveAccessibilityPrefs(nextPrefs);
    applyAccessibilityPrefs(nextPrefs);
  });

  contrastBtn?.addEventListener('click', () => {
    const current = getAccessibilityPrefs();
    const nextPrefs = { ...current, contrast: !document.body.classList.contains('contrast') };
    saveAccessibilityPrefs(nextPrefs);
    applyAccessibilityPrefs(nextPrefs);
  });

  themeBtn?.addEventListener('click', () => {
    const current = getAccessibilityPrefs();
    const nextPrefs = { ...current, dark: !document.body.classList.contains('dark') };
    saveAccessibilityPrefs(nextPrefs);
    applyAccessibilityPrefs(nextPrefs);
  });
}

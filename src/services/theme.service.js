export class ThemeService {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggle();
    this.watchSystemTheme();
  }

  getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  getStoredTheme() {
    return localStorage.getItem("pokeblog-theme");
  }

  storeTheme(theme) {
    localStorage.setItem("pokeblog-theme", theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    this.updateToggleIcon();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
    this.storeTheme(newTheme);
  }

  updateToggleIcon() {
    const themeIcon = document.querySelector(".theme-icon");
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === "light" ? "🌙" : "☀️";
    }
  }

  setupToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? "dark" : "light");
      }
    });
  }
}

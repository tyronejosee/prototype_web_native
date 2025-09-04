import { Router } from "./router.js";
import { HeaderComponent } from "./components/header/header.component.js";
import { ThemeService } from "./services/theme.service.js";

class App {
  constructor() {
    this.router = null;
    this.headerComponent = null;
    this.themeService = null;
  }

  async init() {
    try {
      // Initialize services
      this.themeService = new ThemeService();
      this.themeService.init();

      // Initialize components
      this.headerComponent = new HeaderComponent();
      this.headerComponent.init();

      // Initialize router
      this.router = new Router();
      await this.router.init();

      // Set up global error handling
      this.setupErrorHandling();

      console.log("🚀 PokéBlog App initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize app:", error);
      this.showError(
        "Failed to initialize the application. Please refresh the page."
      );
    }
  }

  setupErrorHandling() {
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      this.showError("An unexpected error occurred. Please try again.");
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      this.showError(
        "A network error occurred. Please check your connection and try again."
      );
      event.preventDefault();
    });
  }

  showError(message) {
    const errorModal = document.getElementById("error-modal");
    const errorMessage = document.getElementById("error-message");
    const errorClose = document.getElementById("error-close");

    if (errorModal && errorMessage) {
      errorMessage.textContent = message;
      errorModal.classList.remove("hidden");

      errorClose.onclick = () => {
        errorModal.classList.add("hidden");
      };

      errorModal.onclick = (e) => {
        if (e.target === errorModal) {
          errorModal.classList.add("hidden");
        }
      };
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});

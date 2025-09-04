import { getErrorMessage } from "../../utils/helpers.js";
import "./error.css";

export class ErrorComponent {
  static show(error, title = "Oops! Something went wrong") {
    const errorModal = document.getElementById("error-modal");
    const errorMessage = document.getElementById("error-message");
    const errorTitle = errorModal.querySelector("h3");
    const errorClose = document.getElementById("error-close");

    if (errorModal && errorMessage && errorTitle) {
      errorTitle.textContent = title;
      errorMessage.textContent = getErrorMessage(error);
      errorModal.classList.remove("hidden");

      // Set up close handlers
      const closeModal = () => {
        errorModal.classList.add("hidden");
      };

      errorClose.onclick = closeModal;

      errorModal.onclick = (e) => {
        if (e.target === errorModal) {
          closeModal();
        }
      };

      // Auto-close after 10 seconds
      setTimeout(closeModal, 10000);
    }
  }

  static createInline(error, options = {}) {
    const {
      title = "Error",
      showRetry = false,
      retryCallback = null,
    } = options;

    const errorContainer = document.createElement("div");
    errorContainer.className = "error-inline text-center p-8";

    errorContainer.innerHTML = `
      <div class="error-icon mb-4">⚠️</div>
      <h3 class="error-title mb-2 text-error-500">${title}</h3>
      <p class="error-message mb-4 text-muted">${getErrorMessage(error)}</p>
      ${
        showRetry && retryCallback
          ? '<button class="btn btn-primary retry-btn">Try Again</button>'
          : ""
      }
    `;

    if (showRetry && retryCallback) {
      const retryBtn = errorContainer.querySelector(".retry-btn");
      retryBtn.addEventListener("click", retryCallback);
    }

    return errorContainer;
  }

  static createNotFound(resource = "Pokemon") {
    return ErrorComponent.createInline(`${resource} not found`, {
      title: "Not Found",
      showRetry: false,
    });
  }

  static createNetworkError(retryCallback = null) {
    return ErrorComponent.createInline(
      "Unable to connect to the Pokemon API. Please check your internet connection.",
      {
        title: "Network Error",
        showRetry: !!retryCallback,
        retryCallback,
      }
    );
  }
}

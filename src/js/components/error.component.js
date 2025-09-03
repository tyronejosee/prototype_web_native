import { getErrorMessage } from "../utils/helpers.js";

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

    // Add error styles if not present
    if (!document.head.querySelector(".error-inline-styles")) {
      const style = document.createElement("style");
      style.classList.add("error-inline-styles");
      style.textContent = `
        .error-inline {
          background-color: var(--bg-secondary);
          border: 1px solid var(--error-500);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
        }
        
        .error-icon {
          font-size: var(--font-size-4xl);
          opacity: 0.7;
        }
        
        .error-title {
          font-size: var(--font-size-xl);
          color: var(--error-500);
          font-weight: var(--font-weight-semibold);
        }
        
        .error-message {
          font-size: var(--font-size-base);
        }
        
        .text-error-500 {
          color: var(--error-500);
        }
      `;
      document.head.appendChild(style);
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

import "./loading.css";

export class LoadingComponent {
  static show(message = "Loading...") {
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingText = loadingOverlay.querySelector(".loading-text");

    if (loadingText) {
      loadingText.textContent = message;
    }

    loadingOverlay.classList.remove("hidden");
  }

  static hide() {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.classList.add("hidden");
  }

  static createInline(message = "Loading...") {
    const container = document.createElement("div");
    container.className = "loading-inline text-center p-8";
    container.innerHTML = `
      <div class="loading-spinner-inline"></div>
      <p class="loading-text-inline">${message}</p>
    `;

    // Add inline styles for the spinner
    const style = document.createElement("style");
    style.textContent = `
      .loading-spinner-inline {
        width: 30px;
        height: 30px;
        border: 3px solid var(--gray-300);
        border-top: 3px solid var(--primary-500);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      .loading-text-inline {
        color: var(--text-muted);
        font-size: var(--font-size-base);
        margin: 0;
      }
    `;

    if (!document.head.querySelector(".loading-inline-styles")) {
      style.classList.add("loading-inline-styles");
      document.head.appendChild(style);
    }

    return container;
  }

  static createSkeleton(type = "card") {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-loader";

    if (type === "card") {
      skeleton.innerHTML = `
        <div class="skeleton-image"></div>
        <div class="skeleton-text skeleton-text-lg"></div>
        <div class="skeleton-text skeleton-text-sm"></div>
        <div class="skeleton-badges">
          <div class="skeleton-badge"></div>
          <div class="skeleton-badge"></div>
        </div>
      `;
    } else if (type === "detail") {
      skeleton.innerHTML = `
        <div class="skeleton-detail-header">
          <div class="skeleton-image-large"></div>
          <div class="skeleton-text skeleton-text-xl"></div>
          <div class="skeleton-text skeleton-text-md"></div>
        </div>
        <div class="skeleton-detail-content">
          <div class="skeleton-text skeleton-text-lg"></div>
          <div class="skeleton-text skeleton-text-base"></div>
          <div class="skeleton-text skeleton-text-base"></div>
        </div>
      `;
    }

    return skeleton;
  }
}

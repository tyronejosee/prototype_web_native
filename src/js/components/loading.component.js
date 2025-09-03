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

    // Add skeleton styles if not already present
    if (!document.head.querySelector(".skeleton-styles")) {
      const style = document.createElement("style");
      style.classList.add("skeleton-styles");
      style.textContent = `
        .skeleton-loader {
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
        }
        
        .skeleton-image, .skeleton-image-large, .skeleton-text, .skeleton-badge {
          background: linear-gradient(90deg, var(--gray-300) 25%, var(--gray-200) 50%, var(--gray-300) 75%);
          background-size: 200% 100%;
          animation: skeleton-pulse 2s infinite;
          border-radius: var(--radius-md);
        }
        
        .skeleton-image {
          width: 120px;
          height: 120px;
          margin: 0 auto var(--spacing-4);
        }
        
        .skeleton-image-large {
          width: 200px;
          height: 200px;
          margin: 0 auto var(--spacing-4);
        }
        
        .skeleton-text {
          height: 1.2em;
          margin-bottom: var(--spacing-2);
        }
        
        .skeleton-text-lg { height: 1.5em; }
        .skeleton-text-xl { height: 2em; }
        .skeleton-text-sm { height: 1em; width: 60%; margin: 0 auto var(--spacing-2); }
        .skeleton-text-md { width: 80%; margin: 0 auto var(--spacing-2); }
        
        .skeleton-badges {
          display: flex;
          gap: var(--spacing-2);
          justify-content: center;
          margin-top: var(--spacing-3);
        }
        
        .skeleton-badge {
          width: 60px;
          height: 24px;
        }
        
        .skeleton-detail-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
        }
        
        .skeleton-detail-content > .skeleton-text {
          margin-bottom: var(--spacing-4);
        }
        
        @keyframes skeleton-pulse {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }

    return skeleton;
  }
}

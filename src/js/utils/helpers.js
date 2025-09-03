// String manipulation helpers
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPokemonName(name) {
  return name.split("-").map(capitalize).join(" ");
}

export function formatPokemonId(id) {
  return `#${id.toString().padStart(3, "0")}`;
}

// Number formatting helpers
export function formatHeight(height) {
  const meters = height / 10;
  return `${meters}m`;
}

export function formatWeight(weight) {
  const kilograms = weight / 10;
  return `${kilograms}kg`;
}

// Array helpers
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// URL helpers
export function getImageUrl(pokemon, imageType = "default") {
  if (!pokemon || !pokemon.sprites) {
    return "https://via.placeholder.com/150x150?text=No+Image";
  }

  const sprites = pokemon.sprites;

  switch (imageType) {
    case "artwork":
      return (
        sprites.other?.["official-artwork"]?.front_default ||
        sprites.front_default ||
        "https://via.placeholder.com/150x150?text=No+Image"
      );
    case "shiny":
      return (
        sprites.front_shiny ||
        sprites.front_default ||
        "https://via.placeholder.com/150x150?text=No+Image"
      );
    default:
      return (
        sprites.front_default ||
        "https://via.placeholder.com/150x150?text=No+Image"
      );
  }
}

// Time helpers
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return "Less than an hour ago";
  }
}

// DOM helpers
export function createElement(tag, className = "", innerHTML = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Animation helpers
export function fadeIn(element, duration = 300) {
  element.style.opacity = "0";
  element.style.transition = `opacity ${duration}ms ease-in-out`;

  requestAnimationFrame(() => {
    element.style.opacity = "1";
  });
}

export function slideDown(element, duration = 300) {
  element.style.maxHeight = "0";
  element.style.overflow = "hidden";
  element.style.transition = `max-height ${duration}ms ease-in-out`;

  requestAnimationFrame(() => {
    element.style.maxHeight = element.scrollHeight + "px";
  });
}

// Validation helpers
export function isValidPokemonId(id) {
  const numId = parseInt(id);
  return !isNaN(numId) && numId >= 1 && numId <= 1010;
}

export function isValidPokemonName(name) {
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    /^[a-zA-Z\-]+$/.test(name.trim())
  );
}

// Debounce helper for search
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling helpers
export function getErrorMessage(error) {
  if (error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

export function handleAsyncError(
  promise,
  fallbackMessage = "Operation failed"
) {
  return promise.catch((error) => {
    console.error("Async error:", error);
    throw new Error(fallbackMessage);
  });
}

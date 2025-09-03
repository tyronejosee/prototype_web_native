import {
  formatPokemonName,
  formatPokemonId,
  getImageUrl,
} from "../utils/helpers.js";
import { favoritesService } from "../services/favorites.service.js";

export class PokemonCardComponent {
  static create(pokemon, options = {}) {
    const {
      showFavorite = true,
      size = "normal",
      clickAction = "detail",
    } = options;

    const card = document.createElement("div");
    card.className = `pokemon-card ${
      size === "small" ? "pokemon-card-small" : ""
    }`;
    card.dataset.pokemonId = pokemon.id;
    card.dataset.page = clickAction === "detail" ? "pokemon" : "";

    const imageUrl = getImageUrl(pokemon, "artwork");
    const isFavorite = favoritesService.isFavorite(pokemon.id);

    card.innerHTML = `
      <div class="pokemon-card-content">
        <img 
          src="${imageUrl}" 
          alt="${formatPokemonName(pokemon.name)}"
          class="pokemon-image"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/150x150?text=No+Image'"
        />
        
        <div class="pokemon-info">
          <p class="pokemon-id">${formatPokemonId(pokemon.id)}</p>
          <h3 class="pokemon-name">${formatPokemonName(pokemon.name)}</h3>
          
          <div class="pokemon-types">
            ${
              pokemon.types
                ?.map(
                  (type) =>
                    `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
                )
                .join("") || ""
            }
          </div>
        </div>
        
        ${
          showFavorite
            ? `
          <button 
            class="favorite-btn ${isFavorite ? "active" : ""}" 
            data-pokemon-id="${pokemon.id}"
            title="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
            aria-label="${
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }"
          >
            ${isFavorite ? "❤️" : "🤍"}
          </button>
        `
            : ""
        }
      </div>
    `;

    // Add favorite toggle functionality
    if (showFavorite) {
      const favoriteBtn = card.querySelector(".favorite-btn");
      favoriteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        PokemonCardComponent.handleFavoriteToggle(pokemon, favoriteBtn);
      });
    }

    return card;
  }

  static handleFavoriteToggle(pokemon, button) {
    const wasAdded = favoritesService.toggleFavorite(pokemon);
    const isFavorite = favoritesService.isFavorite(pokemon.id);

    // Update button appearance
    button.classList.toggle("active", isFavorite);
    button.innerHTML = isFavorite ? "❤️" : "🤍";
    button.title = isFavorite ? "Remove from favorites" : "Add to favorites";

    // Show feedback
    PokemonCardComponent.showFavoriteMessage(pokemon.name, wasAdded);
  }

  static showFavoriteMessage(pokemonName, wasAdded) {
    const message = wasAdded
      ? `${formatPokemonName(pokemonName)} added to favorites!`
      : `${formatPokemonName(pokemonName)} removed from favorites.`;

    // Create toast notification
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(${wasAdded ? "--success-500" : "--warning-500"});
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: var(--shadow-lg);
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
    });

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  static createGrid(pokemon, options = {}) {
    const grid = document.createElement("div");
    grid.className = `grid ${options.gridClass || "grid-4"}`;

    pokemon.forEach((p) => {
      const card = PokemonCardComponent.create(p, options);
      grid.appendChild(card);
    });

    return grid;
  }
}

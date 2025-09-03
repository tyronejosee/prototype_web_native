import { pokemonService } from "../services/pokemon.service.js";
import { favoritesService } from "../services/favorites.service.js";
import { LoadingComponent } from "../components/loading.component.js";
import { ErrorComponent } from "../components/error.component.js";
import {
  formatPokemonName,
  formatPokemonId,
  getImageUrl,
  formatHeight,
  formatWeight,
} from "../utils/helpers.js";

export class PokemonDetailPage {
  constructor() {
    this.container = document.getElementById("main-content");
    this.pokemon = null;
    this.evolutionChain = [];
  }

  async render(pokemonIdOrName) {
    if (!pokemonIdOrName) {
      this.container.innerHTML = ErrorComponent.createNotFound().outerHTML;
      return;
    }

    // Show loading state
    this.container.innerHTML = `
      <div class="pokemon-detail-page">
        ${LoadingComponent.createSkeleton("detail").outerHTML}
      </div>
    `;

    await this.loadPokemon(pokemonIdOrName);
  }

  async loadPokemon(idOrName) {
    try {
      // Fetch Pokemon data
      this.pokemon = await pokemonService.getPokemon(idOrName);

      // Render the Pokemon detail
      this.renderPokemonDetail();

      // Load evolution chain in background
      this.loadEvolutionChain();
    } catch (error) {
      console.error("Error loading Pokemon:", error);
      this.container.innerHTML = "";

      if (error.message.includes("not found")) {
        this.container.appendChild(ErrorComponent.createNotFound());
      } else {
        this.container.appendChild(
          ErrorComponent.createNetworkError(() => this.loadPokemon(idOrName))
        );
      }
    }
  }

  renderPokemonDetail() {
    const pokemon = this.pokemon;
    const imageUrl = getImageUrl(pokemon, "artwork");
    const isFavorite = favoritesService.isFavorite(pokemon.id);

    this.container.innerHTML = `
      <div class="pokemon-detail fade-in">
        <div class="pokemon-header">
          <button class="btn btn-outline mb-6" onclick="history.back()" aria-label="Go back">
            ← Back
          </button>
          
          <img 
            src="${imageUrl}" 
            alt="${formatPokemonName(pokemon.name)}"
            class="pokemon-image-large"
            onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'"
          />
          
          <p class="pokemon-id">${formatPokemonId(pokemon.id)}</p>
          <h1 class="pokemon-name">${formatPokemonName(pokemon.name)}</h1>
          
          <div class="pokemon-types mb-4">
            ${pokemon.types
              .map(
                (type) =>
                  `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
              )
              .join("")}
          </div>
          
          <button 
            class="favorite-btn ${isFavorite ? "active" : ""}" 
            id="favorite-toggle"
            title="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
          >
            ${isFavorite ? "❤️" : "🤍"} ${
      isFavorite ? "Remove from" : "Add to"
    } Favorites
          </button>
        </div>

        <div class="pokemon-info-grid">
          <div class="info-section">
            <h3>Basic Information</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Height:</span>
                <span class="info-value">${formatHeight(pokemon.height)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Weight:</span>
                <span class="info-value">${formatWeight(pokemon.weight)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Base Experience:</span>
                <span class="info-value">${
                  pokemon.base_experience || "Unknown"
                }</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Abilities</h3>
            <div class="abilities-grid">
              ${pokemon.abilities
                .map(
                  (ability) => `
                <div class="ability-item">
                  <span class="ability-name">${formatPokemonName(
                    ability.ability.name
                  )}</span>
                  ${
                    ability.is_hidden
                      ? '<span class="hidden-ability">Hidden</span>'
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Base Stats</h3>
          <div class="stats-detailed">
            ${pokemon.stats
              .map(
                (stat) => `
              <div class="stat-row">
                <span class="stat-name">${formatPokemonName(
                  stat.stat.name
                )}</span>
                <div class="stat-bar-container">
                  <div class="stat-bar">
                    <div 
                      class="stat-fill" 
                      style="width: ${Math.min(
                        (stat.base_stat / 255) * 100,
                        100
                      )}%"
                    ></div>
                  </div>
                  <span class="stat-number">${stat.base_stat}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="info-section">
          <h3>Evolution Chain</h3>
          <div id="evolution-chain">
            ${
              LoadingComponent.createInline("Loading evolution chain...")
                .outerHTML
            }
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.addDetailStyles();
  }

  setupEventListeners() {
    const favoriteToggle = document.getElementById("favorite-toggle");
    favoriteToggle.addEventListener("click", () => {
      const wasAdded = favoritesService.toggleFavorite(this.pokemon);
      const isFavorite = favoritesService.isFavorite(this.pokemon.id);

      favoriteToggle.classList.toggle("active", isFavorite);
      favoriteToggle.innerHTML = `${isFavorite ? "❤️" : "🤍"} ${
        isFavorite ? "Remove from" : "Add to"
      } Favorites`;
      favoriteToggle.title = isFavorite
        ? "Remove from favorites"
        : "Add to favorites";
    });
  }

  async loadEvolutionChain() {
    try {
      const evolutionContainer = document.getElementById("evolution-chain");

      this.evolutionChain = await pokemonService.getEvolutionChain(
        this.pokemon
      );

      if (this.evolutionChain.length <= 1) {
        evolutionContainer.innerHTML = `
          <p class="text-muted text-center">This Pokémon does not evolve.</p>
        `;
        return;
      }

      evolutionContainer.innerHTML = "";
      const evolutionChainEl = this.createEvolutionChain();
      evolutionContainer.appendChild(evolutionChainEl);
    } catch (error) {
      console.error("Error loading evolution chain:", error);
      const evolutionContainer = document.getElementById("evolution-chain");
      evolutionContainer.innerHTML = `
        <p class="text-muted text-center">Failed to load evolution chain.</p>
      `;
    }
  }

  createEvolutionChain() {
    const container = document.createElement("div");
    container.className = "evolution-chain";

    this.evolutionChain.forEach((pokemon, index) => {
      // Evolution item
      const evolutionItem = document.createElement("div");
      evolutionItem.className = "evolution-item";
      evolutionItem.innerHTML = `
        <img 
          src="${getImageUrl(pokemon, "artwork")}" 
          alt="${formatPokemonName(pokemon.name)}"
          class="evolution-image"
          data-pokemon-id="${pokemon.id}"
          data-page="pokemon"
        />
        <p class="evolution-name">${formatPokemonName(pokemon.name)}</p>
      `;

      container.appendChild(evolutionItem);

      // Add arrow between evolutions (except for the last one)
      if (index < this.evolutionChain.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "evolution-arrow";
        arrow.innerHTML = "→";
        container.appendChild(arrow);
      }
    });

    return container;
  }

  addDetailStyles() {
    if (!document.head.querySelector(".detail-styles")) {
      const style = document.createElement("style");
      style.classList.add("detail-styles");
      style.textContent = `
        .pokemon-detail {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .info-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-2) 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-item:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
        }
        
        .info-value {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }
        
        .abilities-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }
        
        .ability-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-3);
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }
        
        .ability-name {
          font-weight: var(--font-weight-medium);
        }
        
        .hidden-ability {
          background-color: var(--warning-500);
          color: white;
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }
        
        .stats-detailed {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }
        
        .stat-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }
        
        .stat-name {
          min-width: 120px;
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
        }
        
        .stat-bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }
        
        .stat-bar {
          flex: 1;
          height: 8px;
          background-color: var(--gray-300);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        
        .stat-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-500) 0%, var(--secondary-500) 100%);
          transition: width var(--transition-slow);
        }
        
        .stat-number {
          min-width: 40px;
          font-weight: var(--font-weight-semibold);
          text-align: right;
          color: var(--text-primary);
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.pokemon = null;
    this.evolutionChain = [];
  }
}

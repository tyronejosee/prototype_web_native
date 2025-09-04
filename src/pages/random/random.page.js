import { pokemonService } from "../../services/pokemon.service.js";
import { PokemonCardComponent } from "../../components/pokemon-card/pokemon-card.component.js";
import { LoadingComponent } from "../../components/loading/loading.component.js";
import { ErrorComponent } from "../../components/error/error.component.js";
import {
  formatPokemonName,
  formatPokemonId,
  getImageUrl,
  formatHeight,
  formatWeight,
} from "../../utils/helpers.js";
import "./random.css";

export class RandomPage {
  constructor() {
    this.container = document.getElementById("main-content");
    this.currentPokemon = null;
  }

  async render() {
    this.container.innerHTML = `
      <div class="random-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Random Pokémon Discovery</h1>
          <p class="page-subtitle">Discover something new with each visit</p>
        </div>

        <div class="random-controls text-center mb-8">
          <button class="btn btn-primary" id="generate-random">🎲 Generate Random Pokémon</button>
        </div>

        <div id="random-pokemon-container">
          ${
            LoadingComponent.createInline("Finding a random Pokémon for you...")
              .outerHTML
          }
        </div>
      </div>
    `;

    this.setupEventListeners();
    await this.loadRandomPokemon();
  }

  setupEventListeners() {
    const generateBtn = document.getElementById("generate-random");
    generateBtn.addEventListener("click", async () => {
      await this.loadRandomPokemon();
    });
  }

  async loadRandomPokemon() {
    try {
      const container = document.getElementById("random-pokemon-container");

      // Show loading
      container.innerHTML = LoadingComponent.createInline(
        "Finding a random Pokémon for you..."
      ).outerHTML;

      // Fetch random Pokemon
      this.currentPokemon = await pokemonService.getRandomPokemon();

      // Clear loading and render Pokemon
      container.innerHTML = "";
      container.appendChild(this.createRandomPokemonDisplay());

      // Add animation
      container.classList.add("fade-in");
    } catch (error) {
      console.error("Error loading random Pokemon:", error);
      const container = document.getElementById("random-pokemon-container");
      container.innerHTML = "";
      container.appendChild(
        ErrorComponent.createNetworkError(() => this.loadRandomPokemon())
      );
    }
  }

  createRandomPokemonDisplay() {
    const pokemon = this.currentPokemon;
    const container = document.createElement("div");
    container.className = "random-pokemon-display";

    const imageUrl = getImageUrl(pokemon, "artwork");

    container.innerHTML = `
      <div class="random-pokemon-card">
        <div class="pokemon-image-section text-center">
          <img 
            src="${imageUrl}" 
            alt="${formatPokemonName(pokemon.name)}"
            class="pokemon-image-large"
            onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'"
          />
        </div>
        
        <div class="pokemon-details">
          <div class="pokemon-header text-center mb-6">
            <p class="pokemon-id text-muted">${formatPokemonId(pokemon.id)}</p>
            <h2 class="pokemon-name">${formatPokemonName(pokemon.name)}</h2>
            
            <div class="pokemon-types">
              ${pokemon.types
                .map(
                  (type) =>
                    `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
                )
                .join("")}
            </div>
          </div>
          
          <div class="pokemon-quick-stats">
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">${formatHeight(pokemon.height)}</span>
                <span class="stat-label">Height</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">${formatWeight(pokemon.weight)}</span>
                <span class="stat-label">Weight</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">${
                  pokemon.base_experience || "Unknown"
                }</span>
                <span class="stat-label">Base XP</span>
              </div>
            </div>
          </div>
          
          <div class="pokemon-abilities mb-6">
            <h3 class="mb-4">Abilities</h3>
            <div class="abilities-list">
              ${pokemon.abilities
                .map(
                  (ability) => `
                <span class="ability-badge">${formatPokemonName(
                  ability.ability.name
                )}</span>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div class="random-actions text-center">
            <button class="btn btn-secondary" id="view-details">View Full Details</button>
            <button class="btn btn-primary" id="add-to-favorites">Add to Favorites</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    const viewDetailsBtn = container.querySelector("#view-details");
    const addToFavoritesBtn = container.querySelector("#add-to-favorites");

    viewDetailsBtn.addEventListener("click", () => {
      window.history.pushState({}, "", `#pokemon/${pokemon.id}`);
      // Let the router handle the navigation
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    addToFavoritesBtn.addEventListener("click", () => {
      PokemonCardComponent.handleFavoriteToggle(pokemon, addToFavoritesBtn);
    });

    return container;
  }

  async loadTypes() {
    try {
      const typesContainer = document.getElementById("types-grid");
      typesContainer.innerHTML = "";

      // Create type cards from constants
      Object.entries(POKEMON_TYPES).forEach(([typeKey, typeData]) => {
        const typeCard = this.createTypeCard(typeKey, typeData);
        typesContainer.appendChild(typeCard);
      });
    } catch (error) {
      console.error("Error loading types:", error);
      const typesContainer = document.getElementById("types-grid");
      typesContainer.innerHTML = "";
      typesContainer.appendChild(
        ErrorComponent.createNetworkError(() => this.loadTypes())
      );
    }
  }

  createTypeCard(typeKey, typeData) {
    const card = document.createElement("div");
    card.className = "category-card";
    card.style.cursor = "pointer";

    // Get type emoji based on type name
    const typeEmoji = this.getTypeEmoji(typeKey);

    card.innerHTML = `
      <div class="type-icon" style="
        width: 80px; 
        height: 80px; 
        background: ${typeData.color}; 
        border-radius: 50%; 
        margin: 0 auto var(--spacing-4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-4xl);
        transition: transform var(--transition-fast);
      ">
        ${typeEmoji}
      </div>
      <h3 class="type-name">${typeData.name}</h3>
      <p class="type-description text-muted">Explore ${typeData.name.toLowerCase()}-type Pokémon</p>
    `;

    // Add hover effect
    card.addEventListener("mouseenter", () => {
      const icon = card.querySelector(".type-icon");
      icon.style.transform = "scale(1.1)";
    });

    card.addEventListener("mouseleave", () => {
      const icon = card.querySelector(".type-icon");
      icon.style.transform = "scale(1)";
    });

    card.addEventListener("click", () => {
      window.history.pushState({}, "", `#categories/${typeKey}`);
      this.renderTypeDetail(typeKey);
    });

    return card;
  }

  getTypeEmoji(type) {
    const emojis = {
      normal: "🐾",
      fire: "🔥",
      water: "💧",
      electric: "⚡",
      grass: "🌿",
      ice: "❄️",
      fighting: "👊",
      poison: "☠️",
      ground: "🌍",
      flying: "🦅",
      psychic: "🔮",
      bug: "🐛",
      rock: "🪨",
      ghost: "👻",
      dragon: "🐉",
      dark: "🌑",
      steel: "⚙️",
      fairy: "🧚",
    };
    return emojis[type] || "❓";
  }

  async loadTypeDetail(typeName) {
    try {
      const pokemonContainer = document.getElementById("type-pokemon");

      // Show loading skeletons
      pokemonContainer.innerHTML = this.createPokemonSkeletonGrid(20);

      // Fetch Pokemon by type
      const typeData = await pokemonService.getPokemonByType(typeName);
      this.pokemonData = typeData.pokemon;

      // Clear loading state
      pokemonContainer.innerHTML = "";

      if (this.pokemonData.length === 0) {
        pokemonContainer.appendChild(this.createEmptyState(typeName));
        return;
      }

      // Create Pokemon cards
      this.pokemonData.forEach((pokemon) => {
        const card = PokemonCardComponent.create(pokemon);
        pokemonContainer.appendChild(card);
      });

      // Add fade-in animation
      pokemonContainer.classList.add("fade-in");
    } catch (error) {
      console.error("Error loading type detail:", error);
      const pokemonContainer = document.getElementById("type-pokemon");
      pokemonContainer.innerHTML = "";
      pokemonContainer.appendChild(
        ErrorComponent.createNetworkError(() => this.loadTypeDetail(typeName))
      );
    }
  }

  createEmptyState(typeName) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <div class="empty-state-icon">🔍</div>
      <h3 class="empty-state-title">No ${
        POKEMON_TYPES[typeName]?.name || typeName
      } Pokémon Found</h3>
      <p class="empty-state-description">We couldn't find any Pokémon of this type at the moment.</p>
      <button class="btn btn-primary" onclick="window.history.back()">← Back to Categories</button>
    `;
    return emptyState;
  }

  destroy() {
    this.currentType = null;
    this.pokemonData = [];
  }
}

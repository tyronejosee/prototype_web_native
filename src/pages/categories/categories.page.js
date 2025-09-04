import { pokemonService } from "../../services/pokemon.service.js";
import { PokemonCardComponent } from "../../components/pokemon-card/pokemon-card.component.js";
import { LoadingComponent } from "../../components/loading/loading.component.js";
import { ErrorComponent } from "../../components/error/error.component.js";
import { POKEMON_TYPES } from "../../utils/constants.js";

export class CategoriesPage {
  constructor() {
    this.container = document.getElementById("main-content");
    this.currentType = null;
    this.pokemonData = [];
  }

  async render(params) {
    this.currentType = params;
    if (this.currentType) {
      await this.renderTypeDetail(this.currentType);
    } else {
      await this.renderTypesGrid();
    }
  }

  async renderTypesGrid() {
    this.container.innerHTML = `
      <div class="categories-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Pokémon Categories</h1>
          <p class="page-subtitle">Explore Pokémon by their elemental types</p>
        </div>

        <div id="types-grid" class="category-grid">
          ${this.createTypesSkeletonGrid()}
        </div>
      </div>
    `;
    await this.loadTypes();
  }

  async renderTypeDetail(typeName) {
    this.container.innerHTML = `
      <div class="type-detail-page fade-in">
        <div class="page-header">
          <h1 class="page-title">${
            POKEMON_TYPES[typeName]?.name || typeName
          } Type Pokémon</h1>
          <p class="page-subtitle">Discover all ${typeName}-type Pokémon</p>
        </div>

        <div id="type-pokemon" class="grid grid-4">
          ${this.createPokemonSkeletonGrid(20)}
        </div>
      </div>
    `;
    await this.loadTypeDetail(typeName);
  }

  createTypesSkeletonGrid() {
    return Object.keys(POKEMON_TYPES)
      .map(
        () => `
        <div class="category-card">
          <div style="width: 60px; height: 60px; background: var(--gray-300); border-radius: 50%; margin: 0 auto var(--spacing-4);"></div>
          <div style="height: 1.5em; background: var(--gray-300); border-radius: var(--radius-md); margin-bottom: var(--spacing-2);"></div>
          <div style="height: 1em; background: var(--gray-300); border-radius: var(--radius-md); width: 70%; margin: 0 auto;"></div>
        </div>
      `
      )
      .join("");
  }

  createPokemonSkeletonGrid(count) {
    return Array(count)
      .fill(0)
      .map(() => LoadingComponent.createSkeleton("card").outerHTML)
      .join("");
  }

  async loadTypes() {
    try {
      const typesContainer = document.getElementById("types-grid");
      typesContainer.innerHTML = "";
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

    card.innerHTML = `
      <div class="type-icon" style="
        width: 60px; 
        height: 60px; 
        background: ${typeData.color}; 
        border-radius: 50%; 
        margin: 0 auto var(--spacing-4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-2xl);
        color: white;
        font-weight: var(--font-weight-bold);
      ">
        ${typeData.name.charAt(0)}
      </div>
      <h3 class="type-name" style="margin-bottom: var(--spacing-2);">${
        typeData.name
      }</h3>
      <p class="type-description text-muted">Explore ${typeData.name.toLowerCase()}-type Pokémon</p>
    `;

    card.addEventListener("click", () => {
      window.history.pushState({}, "", `#categories/${typeKey}`);
      this.renderTypeDetail(typeKey);
    });

    return card;
  }

  async loadTypeDetail(typeName) {
    try {
      const pokemonContainer = document.getElementById("type-pokemon");
      pokemonContainer.innerHTML = this.createPokemonSkeletonGrid(20);

      const typeData = await pokemonService.getPokemonByType(typeName);
      pokemonContainer.innerHTML = "";

      if (typeData.pokemon.length === 0) {
        pokemonContainer.appendChild(this.createEmptyState(typeName));
        return;
      }

      typeData.pokemon.forEach((pokemon) => {
        const card = PokemonCardComponent.create(pokemon);
        pokemonContainer.appendChild(card);
      });

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
      <button class="btn btn-primary" data-page="categories">← Back to Categories</button>
    `;
    return emptyState;
  }

  destroy() {
    this.currentType = null;
    this.pokemonData = [];
  }
}

import { favoritesService } from "../../services/favorites.service.js";
import { PokemonCardComponent } from "../../components/pokemon-card/pokemon-card.component.js";
import { timeAgo } from "../../utils/helpers.js";
import "./favorites.css";

export class FavoritesPage {
  constructor() {
    this.container = document.getElementById("main-content");
    this.favorites = [];
  }

  async render() {
    this.favorites = favoritesService.getFavorites();

    this.container.innerHTML = `
      <div class="favorites-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Your Favorite Pokémon</h1>
          <p class="page-subtitle">
            ${
              this.favorites.length > 0
                ? `You have ${this.favorites.length} favorite Pokémon`
                : "Start building your collection by adding favorites"
            }
          </p>
        </div>

        ${
          this.favorites.length > 0
            ? this.renderFavoritesContent()
            : this.renderEmptyState()
        }
      </div>
    `;

    this.setupEventListeners();
  }

  renderFavoritesContent() {
    return `
      <div class="favorites-filters">
        <div class="filter-group">
          <select id="sort-select" class="form-input">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="id">Pokédex Number</option>
          </select>
        </div>

        <div class="filter-group">
          <select id="type-filter" class="form-input">
            <option value="">All Types</option>
            ${this.getAvailableTypes()
              .map((type) => `<option value="${type}">${type}</option>`)
              .join("")}
          </select>
        </div>

        <div class="favorites-actions">
          <button class="btn btn-outline" id="export-favorites">Export Favorites</button>
          <button class="btn btn-outline" id="import-favorites">Import Favorites</button>
          <button class="btn btn-outline" id="clear-favorites">Clear All</button>
        </div>
      </div>

      <div id="favorites-grid" class="grid grid-4">
        ${this.createFavoritesGrid()}
      </div>

      <input type="file" id="import-file-input" accept=".json" style="display: none;">
    `;
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">💔</div>
        <h3 class="empty-state-title">No Favorite Pokémon Yet</h3>
        <p class="empty-state-description">
          Start exploring and add Pokémon to your favorites by clicking the heart icon on any Pokémon card.
        </p>
        <div class="empty-state-actions">
          <a href="#search" class="btn btn-primary" data-page="search">Search Pokémon</a>
          <a href="#categories" class="btn btn-secondary" data-page="categories">Browse Categories</a>
          <a href="#random" class="btn btn-outline" data-page="random">Discover Random</a>
        </div>
      </div>
    `;
  }

  createFavoritesGrid() {
    let filteredFavorites = [...this.favorites];

    // Apply sorting (default to newest first)
    filteredFavorites.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

    return filteredFavorites
      .map((pokemon) => {
        const card = document.createElement("div");
        card.innerHTML = PokemonCardComponent.create(pokemon).outerHTML;

        // Add favorite date info
        const pokemonCard = card.firstElementChild;
        const favoriteInfo = document.createElement("div");
        favoriteInfo.className = "favorite-info";
        favoriteInfo.innerHTML = `
        <small class="favorite-date">Added ${timeAgo(pokemon.addedAt)}</small>
      `;
        pokemonCard.appendChild(favoriteInfo);

        return card.innerHTML;
      })
      .join("");
  }

  setupEventListeners() {
    // Export favorites
    const exportBtn = document.getElementById("export-favorites");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        favoritesService.exportFavorites();
      });
    }

    // Import favorites
    const importBtn = document.getElementById("import-favorites");
    const importInput = document.getElementById("import-file-input");

    if (importBtn && importInput) {
      importBtn.addEventListener("click", () => {
        importInput.click();
      });

      importInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const count = await favoritesService.importFavorites(file);
            this.favorites = favoritesService.getFavorites();
            await this.render(); // Re-render page
            alert(`Successfully imported ${count} favorites!`);
          } catch (error) {
            alert("Failed to import favorites. Please check the file format.");
          }
        }
      });
    }

    // Clear all favorites
    const clearBtn = document.getElementById("clear-favorites");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to clear all favorites? This action cannot be undone."
          )
        ) {
          favoritesService.clearFavorites();
          this.render(); // Re-render page
        }
      });
    }

    // Sort and filter handlers
    const sortSelect = document.getElementById("sort-select");
    const typeFilter = document.getElementById("type-filter");

    if (sortSelect) {
      sortSelect.addEventListener("change", () =>
        this.updateFavoritesDisplay()
      );
    }

    if (typeFilter) {
      typeFilter.addEventListener("change", () =>
        this.updateFavoritesDisplay()
      );
    }

    // Listen for favorites changes
    window.addEventListener("favoritesChanged", () => {
      this.favorites = favoritesService.getFavorites();
      this.updateFavoritesDisplay();
    });
  }

  updateFavoritesDisplay() {
    const favoritesGrid = document.getElementById("favorites-grid");
    const sortSelect = document.getElementById("sort-select");
    const typeFilter = document.getElementById("type-filter");

    if (!favoritesGrid) return;

    let filteredFavorites = [...this.favorites];

    // Apply type filter
    if (typeFilter && typeFilter.value) {
      filteredFavorites = filteredFavorites.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === typeFilter.value)
      );
    }

    // Apply sorting
    if (sortSelect) {
      const sortValue = sortSelect.value;
      switch (sortValue) {
        case "newest":
          filteredFavorites.sort(
            (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
          );
          break;
        case "oldest":
          filteredFavorites.sort(
            (a, b) => new Date(a.addedAt) - new Date(b.addedAt)
          );
          break;
        case "name":
          filteredFavorites.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "id":
          filteredFavorites.sort((a, b) => a.id - b.id);
          break;
      }
    }

    // Update display
    if (filteredFavorites.length === 0) {
      favoritesGrid.innerHTML = `
        <div class="empty-filtered-state text-center p-8" style="grid-column: 1 / -1;">
          <p class="text-muted">No Pokémon match your current filters.</p>
        </div>
      `;
    } else {
      favoritesGrid.innerHTML = "";
      filteredFavorites.forEach((pokemon) => {
        const card = PokemonCardComponent.create(pokemon);

        // Add favorite date info
        const favoriteInfo = document.createElement("div");
        favoriteInfo.className = "favorite-info";
        favoriteInfo.innerHTML = `
          <small class="favorite-date">Added ${timeAgo(pokemon.addedAt)}</small>
        `;
        card.appendChild(favoriteInfo);

        favoritesGrid.appendChild(card);
      });
    }
  }

  getUniqueTypesCount() {
    const types = new Set();
    this.favorites.forEach((pokemon) => {
      pokemon.types.forEach((type) => {
        types.add(type.type.name);
      });
    });
    return types.size;
  }

  getRecentlyAdded() {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return this.favorites.filter(
      (pokemon) => new Date(pokemon.addedAt).getTime() > oneDayAgo
    ).length;
  }

  getAvailableTypes() {
    const types = new Set();
    this.favorites.forEach((pokemon) => {
      pokemon.types.forEach((type) => {
        types.add(type.type.name);
      });
    });
    return Array.from(types).sort();
  }

  destroy() {
    this.favorites = [];

    // Remove event listeners
    window.removeEventListener("favoritesChanged", this.updateFavoritesDisplay);
  }
}

import { pokemonService } from "../services/pokemon.service.js";
import { PokemonCardComponent } from "../components/pokemon-card.component.js";
import { LoadingComponent } from "../components/loading.component.js";
import { ErrorComponent } from "../components/error.component.js";
import {
  debounce,
  isValidPokemonId,
  isValidPokemonName,
} from "../utils/helpers.js";

export class SearchPage {
  constructor() {
    this.container = document.getElementById("main-content");
    this.searchInput = null;
    this.searchResults = null;
    this.currentQuery = "";
    this.searchHistory = this.loadSearchHistory();
  }

  async render() {
    this.container.innerHTML = `
      <div class="search-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Search Pokémon</h1>
          <p class="page-subtitle">Find any Pokémon by name or Pokédex number</p>
        </div>

        <div class="search-container">
          <input 
            type="text" 
            class="search-input"
            id="search-input"
            placeholder="Enter Pokémon name or ID (e.g., Pikachu or 25)"
            autocomplete="off"
          />
          <button class="btn btn-primary search-btn" id="search-btn">Search</button>
        </div>

        <div class="search-suggestions" id="search-suggestions">
          ${this.createSearchSuggestions()}
        </div>

        <div id="search-results" class="search-results">
          ${this.createWelcomeMessage()}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.searchInput = document.getElementById("search-input");
    this.searchResults = document.getElementById("search-results");
    const searchBtn = document.getElementById("search-btn");

    // Immediate search on button click
    searchBtn.addEventListener("click", () => {
      this.performSearch();
    });

    // Search on Enter key
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch();
      }
    });

    // Debounced search as user types
    const debouncedSearch = debounce(() => {
      if (this.searchInput.value.trim()) {
        this.performSearch();
      }
    }, 500);

    this.searchInput.addEventListener("input", debouncedSearch);

    // Focus search input
    this.searchInput.focus();
  }

  async performSearch() {
    const query = this.searchInput.value.trim();

    if (!query) {
      this.searchResults.innerHTML = this.createWelcomeMessage();
      return;
    }

    if (query === this.currentQuery) {
      return; // Don't search for the same query
    }

    this.currentQuery = query;

    try {
      // Show loading
      this.searchResults.innerHTML = LoadingComponent.createInline(
        "Searching for Pokémon..."
      ).outerHTML;

      // Perform search
      const pokemon = await pokemonService.searchPokemon(query);

      // Add to search history
      this.addToSearchHistory(query, pokemon);

      // Show results
      this.renderSearchResult(pokemon);
    } catch (error) {
      console.error("Search error:", error);
      this.searchResults.innerHTML = "";

      if (
        error.message.includes("not found") ||
        error.message.includes("Pokemon ID")
      ) {
        this.searchResults.appendChild(this.createNotFoundMessage(query));
      } else {
        this.searchResults.appendChild(
          ErrorComponent.createNetworkError(() => this.performSearch())
        );
      }
    }
  }

  renderSearchResult(pokemon) {
    this.searchResults.innerHTML = `
      <div class="search-result-header">
        <h2>Search Result</h2>
      </div>
    `;

    const card = PokemonCardComponent.create(pokemon, {
      showFavorite: true,
      size: "large",
    });

    // Add special styling for search result
    card.classList.add("search-result-card");

    this.searchResults.appendChild(card);
    this.addSearchResultStyles();
  }

  createWelcomeMessage() {
    return `
      <div class="search-welcome text-center p-8">
        <div class="welcome-icon">🔍</div>
        <h3 class="welcome-title">Start Your Search</h3>
        <p class="welcome-description">
          Search for any Pokémon by name (like "Pikachu") or by Pokédex number (like "25").
          You can discover over 1000 different Pokémon!
        </p>
        
        <div class="search-tips">
          <h4>Search Tips:</h4>
          <ul>
            <li>Try searching for popular Pokémon like "Charizard", "Mewtwo", or "Lucario"</li>
            <li>Use Pokédex numbers from 1 to 1010</li>
            <li>Names are case-insensitive</li>
          </ul>
        </div>
      </div>
    `;
  }

  createSearchSuggestions() {
    const suggestions = [
      { name: "Pikachu", id: 25 },
      { name: "Charizard", id: 6 },
      { name: "Mewtwo", id: 150 },
      { name: "Lucario", id: 448 },
      { name: "Garchomp", id: 445 },
      { name: "Rayquaza", id: 384 },
    ];

    return `
      <div class="suggestions-container">
        <h3>Popular Searches:</h3>
        <div class="suggestion-tags">
          ${suggestions
            .map(
              (pokemon) => `
            <button class="suggestion-tag" data-query="${pokemon.name}">
              ${pokemon.name}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  createNotFoundMessage(query) {
    const container = document.createElement("div");
    container.className = "search-not-found text-center p-8";
    container.innerHTML = `
      <div class="not-found-icon">❌</div>
      <h3 class="not-found-title">Pokémon Not Found</h3>
      <p class="not-found-description">
        We couldn't find a Pokémon named "${query}". 
        Please check the spelling or try a different name or ID.
      </p>
      <button class="btn btn-primary" id="clear-search">Try Another Search</button>
    `;

    const clearBtn = container.querySelector("#clear-search");
    clearBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchInput.focus();
      this.searchResults.innerHTML = this.createWelcomeMessage();
      this.currentQuery = "";
    });

    return container;
  }

  addSearchResultStyles() {
    if (!document.head.querySelector(".search-result-styles")) {
      const style = document.createElement("style");
      style.classList.add("search-result-styles");
      style.textContent = `
        .search-result-card {
          max-width: 400px;
          margin: 0 auto;
          transform: scale(1.05);
        }
        
        .search-result-header {
          text-align: center;
          margin-bottom: var(--spacing-6);
        }
        
        .search-welcome {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .welcome-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
        }
        
        .welcome-title {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-4);
          color: var(--text-primary);
        }
        
        .welcome-description {
          font-size: var(--font-size-lg);
          color: var(--text-muted);
          margin-bottom: var(--spacing-6);
        }
        
        .search-tips {
          text-align: left;
          background-color: var(--bg-primary);
          padding: var(--spacing-4);
          border-radius: var(--radius-md);
          margin-top: var(--spacing-6);
        }
        
        .search-tips h4 {
          color: var(--primary-500);
          margin-bottom: var(--spacing-3);
        }
        
        .search-tips ul {
          list-style-type: none;
          padding: 0;
        }
        
        .search-tips li {
          padding: var(--spacing-2) 0;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
        }
        
        .search-tips li:last-child {
          border-bottom: none;
        }
        
        .suggestions-container {
          text-align: center;
          margin-bottom: var(--spacing-8);
        }
        
        .suggestions-container h3 {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-4);
        }
        
        .suggestion-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-2);
          justify-content: center;
        }
        
        .suggestion-tag {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: var(--font-size-sm);
        }
        
        .suggestion-tag:hover {
          background-color: var(--primary-500);
          color: white;
          transform: translateY(-1px);
        }
        
        .search-not-found {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          max-width: 500px;
          margin: 0 auto;
        }
        
        .not-found-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
        }
        
        .not-found-title {
          color: var(--error-500);
          margin-bottom: var(--spacing-4);
        }
        
        .not-found-description {
          color: var(--text-muted);
          margin-bottom: var(--spacing-6);
        }
      `;
      document.head.appendChild(style);
    }

    // Add suggestion click handlers
    document.querySelectorAll(".suggestion-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        this.searchInput.value = tag.dataset.query;
        this.performSearch();
      });
    });
  }

  loadSearchHistory() {
    try {
      const stored = localStorage.getItem("pokeblog-search-history");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load search history:", error);
      return [];
    }
  }

  addToSearchHistory(query, pokemon) {
    const historyItem = {
      query: query.toLowerCase(),
      pokemon: {
        id: pokemon.id,
        name: pokemon.name,
      },
      timestamp: Date.now(),
    };

    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(
      (item) => item.query !== query.toLowerCase()
    );

    // Add to beginning
    this.searchHistory.unshift(historyItem);

    // Keep only last 10 searches
    this.searchHistory = this.searchHistory.slice(0, 10);

    // Save to localStorage
    try {
      localStorage.setItem(
        "pokeblog-search-history",
        JSON.stringify(this.searchHistory)
      );
    } catch (error) {
      console.warn("Failed to save search history:", error);
    }
  }

  destroy() {
    this.currentQuery = "";
    this.searchHistory = [];
  }
}

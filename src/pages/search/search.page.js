import { pokemonService } from "../../services/pokemon.service.js";
import { PokemonCardComponent } from "../../components/pokemon-card/pokemon-card.component.js";
import { LoadingComponent } from "../../components/loading/loading.component.js";
import { ErrorComponent } from "../../components/error/error.component.js";
import { debounce } from "../../utils/helpers.js";
import "./search.css";

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

    this.searchInput = document.getElementById("search-input");
    this.searchResults = document.getElementById("search-results");

    this.setupEventListeners();
  }

  setupEventListeners() {
    const searchBtn = document.getElementById("search-btn");

    // Click on search button
    searchBtn.addEventListener("click", () => this.performSearch());

    // Enter key
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch();
    });

    // Debounced input
    const debouncedSearch = debounce(() => {
      if (this.searchInput.value.trim()) this.performSearch();
    }, 500);

    this.searchInput.addEventListener("input", debouncedSearch);

    // Focus
    this.searchInput.focus();

    // Sugerencias
    this.setupSuggestionListeners();
  }

  setupSuggestionListeners() {
    document.querySelectorAll(".suggestion-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        this.searchInput.value = tag.dataset.query;
        this.performSearch();
      });
    });
  }

  async performSearch() {
    const query = this.searchInput.value.trim();

    if (!query) {
      this.searchResults.innerHTML = this.createWelcomeMessage();
      return;
    }

    if (query === this.currentQuery) return; // evitar búsquedas repetidas
    this.currentQuery = query;

    try {
      this.searchResults.innerHTML = LoadingComponent.createInline(
        "Searching for Pokémon..."
      ).outerHTML;

      const pokemon = await pokemonService.searchPokemon(query);

      this.addToSearchHistory(query, pokemon);
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

    card.classList.add("search-result-card");
    this.searchResults.appendChild(card);
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

    container.querySelector("#clear-search").addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchInput.focus();
      this.searchResults.innerHTML = this.createWelcomeMessage();
      this.currentQuery = "";
    });

    return container;
  }

  loadSearchHistory() {
    try {
      const stored = localStorage.getItem("pokeblog-search-history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addToSearchHistory(query, pokemon) {
    const historyItem = {
      query: query.toLowerCase(),
      pokemon: { id: pokemon.id, name: pokemon.name },
      timestamp: Date.now(),
    };

    this.searchHistory = this.searchHistory.filter(
      (item) => item.query !== query.toLowerCase()
    );
    this.searchHistory.unshift(historyItem);
    this.searchHistory = this.searchHistory.slice(0, 10);

    try {
      localStorage.setItem(
        "pokeblog-search-history",
        JSON.stringify(this.searchHistory)
      );
    } catch {}
  }

  destroy() {
    this.currentQuery = "";
    this.searchHistory = [];
    this.searchInput = null;
    this.searchResults = null;

    const style = document.head.querySelector(".search-result-styles");
    if (style) style.remove();
  }
}

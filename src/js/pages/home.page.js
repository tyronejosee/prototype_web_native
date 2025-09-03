import { pokemonService } from "../services/pokemon.service.js";
import { PokemonCardComponent } from "../components/pokemon-card.component.js";
import { LoadingComponent } from "../components/loading.component.js";
import { ErrorComponent } from "../components/error.component.js";

export class HomePage {
  constructor() {
    this.container = document.getElementById("main-content");
  }

  async render() {
    this.container.innerHTML = `
      <div class="home-page fade-in">
        <div class="hero">
          <h1 class="hero-title">Welcome to PokéBlog</h1>
          <p class="hero-subtitle">Discover, explore, and learn about your favorite Pokémon</p>
        </div>

        <section class="featured-section">
          <div class="page-header">
            <h2 class="page-title">Featured Pokémon</h2>
            <p class="page-subtitle">Meet some of the most popular and legendary Pokémon</p>
          </div>
          <div id="featured-pokemon" class="grid grid-4">
            ${this.createSkeletonGrid(8)}
          </div>
        </section>

        <section class="quick-actions">
          <div class="page-header">
            <h2 class="page-title">Quick Actions</h2>
            <p class="page-subtitle">Jump right into exploring</p>
          </div>
          <div class="grid grid-2 gap-6">
            <div class="card text-center">
              <h3 class="mb-4">🔍 Search Pokémon</h3>
              <p class="text-muted mb-6">Find any Pokémon by name or Pokédex number</p>
              <a href="#search" class="btn btn-primary" data-page="search">Start Searching</a>
            </div>
            
            <div class="card text-center">
              <h3 class="mb-4">🎲 Random Discovery</h3>
              <p class="text-muted mb-6">Discover a random Pokémon and learn something new</p>
              <a href="#random" class="btn btn-secondary" data-page="random">Surprise Me</a>
            </div>
            
            <div class="card text-center">
              <h3 class="mb-4">📚 Browse Categories</h3>
              <p class="text-muted mb-6">Explore Pokémon by their elemental types</p>
              <a href="#categories" class="btn btn-outline" data-page="categories">View Categories</a>
            </div>
            
            <div class="card text-center">
              <h3 class="mb-4">❤️ Your Favorites</h3>
              <p class="text-muted mb-6">Access your saved Pokémon collection</p>
              <a href="#favorites" class="btn btn-outline" data-page="favorites">View Favorites</a>
            </div>
          </div>
        </section>
      </div>
    `;

    await this.loadFeaturedPokemon();
  }

  createSkeletonGrid(count) {
    return Array(count)
      .fill(0)
      .map(
        () =>
          '<div class="skeleton-card">' +
          LoadingComponent.createSkeleton("card").innerHTML +
          "</div>"
      )
      .join("");
  }

  async loadFeaturedPokemon() {
    try {
      const featuredContainer = document.getElementById("featured-pokemon");

      // Show loading skeletons
      featuredContainer.innerHTML = this.createSkeletonGrid(8);

      // Fetch featured Pokemon
      const featured = await pokemonService.getFeaturedPokemon();

      // Clear loading state
      featuredContainer.innerHTML = "";

      if (featured.length === 0) {
        featuredContainer.appendChild(this.createEmptyState());
        return;
      }

      // Create Pokemon cards
      featured.forEach((pokemon) => {
        const card = PokemonCardComponent.create(pokemon);
        featuredContainer.appendChild(card);
      });

      // Add fade-in animation
      featuredContainer.classList.add("fade-in");
    } catch (error) {
      console.error("Error loading featured Pokemon:", error);
      const featuredContainer = document.getElementById("featured-pokemon");
      featuredContainer.innerHTML = "";
      featuredContainer.appendChild(
        ErrorComponent.createNetworkError(() => this.loadFeaturedPokemon())
      );
    }
  }

  createEmptyState() {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <div class="empty-state-icon">🔍</div>
      <h3 class="empty-state-title">No Featured Pokémon</h3>
      <p class="empty-state-description">We couldn't load the featured Pokémon at this time.</p>
      <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
    `;
    return emptyState;
  }

  destroy() {
    // Clean up any event listeners or resources
    const featuredContainer = document.getElementById("featured-pokemon");
    if (featuredContainer) {
      featuredContainer.innerHTML = "";
    }
  }
}

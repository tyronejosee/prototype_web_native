import { pokemonService } from "../../services/pokemon.service.js";
import { PokemonCardComponent } from "../../components/pokemon-card/pokemon-card.component.js";
import { LoadingComponent } from "../../components/loading/loading.component.js";
import { ErrorComponent } from "../../components/error/error.component.js";

export class HomePage {
  constructor() {
    this.container = document.getElementById("main-content");
  }

  async render() {
    this.container.innerHTML = `
      <div class="home-page fade-in">

        <section class="featured-section">
          <div class="page-header">
            <h2 class="page-title">Featured Pokémon</h2>
            <p class="page-subtitle">Meet some of the most popular and legendary Pokémon</p>
          </div>
          <div id="featured-pokemon" class="grid grid-4">
            ${this.createSkeletonGrid(8)}
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

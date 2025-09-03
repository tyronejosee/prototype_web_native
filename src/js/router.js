import { HomePage } from "./pages/home.page.js";
import { CategoriesPage } from "./pages/categories.page.js";
import { RandomPage } from "./pages/random.page.js";
import { PokemonDetailPage } from "./pages/pokemon-detail.page.js";
import { SearchPage } from "./pages/search.page.js";
import { FavoritesPage } from "./pages/favorites.page.js";
import { AboutPage } from "./pages/about.page.js";

export class Router {
  constructor() {
    this.routes = {
      home: HomePage,
      categories: CategoriesPage,
      random: RandomPage,
      pokemon: PokemonDetailPage,
      search: SearchPage,
      favorites: FavoritesPage,
      about: AboutPage,
    };

    this.currentPage = null;
    this.defaultRoute = "home";
  }

  async init() {
    // Set up event listeners
    this.setupEventListeners();

    // Handle initial route
    await this.handleRoute();
  }

  setupEventListeners() {
    // Handle navigation clicks
    document.addEventListener("click", async (e) => {
      const link = e.target.closest("[data-page]");
      if (link) {
        e.preventDefault();
        const page = link.dataset.page;
        const pokemonId = link.dataset.pokemonId;

        if (pokemonId) {
          await this.navigate("pokemon", pokemonId);
        } else {
          await this.navigate(page);
        }
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener("popstate", async () => {
      await this.handleRoute();
    });

    // Handle hash changes
    window.addEventListener("hashchange", async () => {
      await this.handleRoute();
    });
  }

  async navigate(route, params = null) {
    try {
      // Update URL
      const hash = params ? `#${route}/${params}` : `#${route}`;
      if (window.location.hash !== hash) {
        window.history.pushState({ route, params }, "", hash);
      }

      // Load the page
      await this.loadPage(route, params);

      // Update active navigation link
      this.updateActiveLink(route);
    } catch (error) {
      console.error("Navigation error:", error);
      await this.navigate(this.defaultRoute);
    }
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1); // Remove #
    const [route, ...paramsParts] = hash.split("/");
    const params = paramsParts.join("/"); // Rejoin in case there are multiple slashes

    const routeName = route || this.defaultRoute;
    await this.loadPage(routeName, params);
    this.updateActiveLink(routeName);
  }

  async loadPage(route, params = null) {
    try {
      this.showLoading();

      // Clean up current page
      if (this.currentPage && typeof this.currentPage.destroy === "function") {
        this.currentPage.destroy();
      }

      // Load new page
      const PageClass = this.routes[route] || this.routes[this.defaultRoute];
      this.currentPage = new PageClass();

      if (typeof this.currentPage.render === "function") {
        await this.currentPage.render(params);
      } else {
        throw new Error(`Page ${route} does not have a render method`);
      }

      this.hideLoading();
    } catch (error) {
      console.error(`Error loading page ${route}:`, error);
      this.hideLoading();

      // Try to load default page if current page fails
      if (route !== this.defaultRoute) {
        await this.navigate(this.defaultRoute);
      }
    }
  }

  updateActiveLink(route) {
    // Remove active class from all navigation links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to current page link
    const activeLink = document.querySelector(`[data-page="${route}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  showLoading() {
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
    }
  }

  hideLoading() {
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
  }
}

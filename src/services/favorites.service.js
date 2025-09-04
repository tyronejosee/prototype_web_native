export class FavoritesService {
  constructor() {
    this.storageKey = "pokeblog-favorites";
    this.favorites = this.loadFavorites();
  }

  // Load favorites from localStorage
  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load favorites from localStorage:", error);
      return [];
    }
  }

  // Save favorites to localStorage
  saveFavorites() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
      this.dispatchFavoritesChanged();
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }

  // Add Pokemon to favorites
  addFavorite(pokemon) {
    const existingIndex = this.favorites.findIndex(
      (fav) => fav.id === pokemon.id
    );

    if (existingIndex === -1) {
      const favoriteData = {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        sprites: pokemon.sprites,
        addedAt: new Date().toISOString(),
      };

      this.favorites.unshift(favoriteData);
      this.saveFavorites();
      return true;
    }

    return false;
  }

  // Remove Pokemon from favorites
  removeFavorite(pokemonId) {
    const index = this.favorites.findIndex((fav) => fav.id === pokemonId);

    if (index !== -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      return true;
    }

    return false;
  }

  // Toggle favorite status
  toggleFavorite(pokemon) {
    if (this.isFavorite(pokemon.id)) {
      return this.removeFavorite(pokemon.id);
    } else {
      return this.addFavorite(pokemon);
    }
  }

  // Check if Pokemon is favorite
  isFavorite(pokemonId) {
    return this.favorites.some((fav) => fav.id === pokemonId);
  }

  // Get all favorites
  getFavorites() {
    return [...this.favorites];
  }

  // Get favorites count
  getFavoritesCount() {
    return this.favorites.length;
  }

  // Clear all favorites
  clearFavorites() {
    this.favorites = [];
    this.saveFavorites();
  }

  // Dispatch custom event when favorites change
  dispatchFavoritesChanged() {
    const event = new CustomEvent("favoritesChanged", {
      detail: {
        favorites: this.getFavorites(),
        count: this.getFavoritesCount(),
      },
    });
    window.dispatchEvent(event);
  }

  // Export favorites as JSON
  exportFavorites() {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      favorites: this.favorites,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `pokeblog-favorites-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  // Import favorites from JSON
  async importFavorites(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.favorites || !Array.isArray(importData.favorites)) {
        throw new Error("Invalid favorites file format");
      }

      // Merge with existing favorites (avoid duplicates)
      importData.favorites.forEach((favorite) => {
        if (!this.isFavorite(favorite.id)) {
          this.favorites.push(favorite);
        }
      });

      this.saveFavorites();
      return importData.favorites.length;
    } catch (error) {
      console.error("Failed to import favorites:", error);
      throw new Error(
        "Failed to import favorites. Please check the file format."
      );
    }
  }
}

export const favoritesService = new FavoritesService();

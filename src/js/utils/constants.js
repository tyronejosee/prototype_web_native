// API Configuration
export const API_BASE_URL = "https://pokeapi.co/api/v2";

export const ENDPOINTS = {
  POKEMON: "/pokemon",
  TYPE: "/type",
  SPECIES: "/pokemon-species",
  EVOLUTION: "/evolution-chain",
};

// Pokemon Types with Colors
export const POKEMON_TYPES = {
  normal: { color: "#A8A878", name: "Normal" },
  fire: { color: "#F08030", name: "Fire" },
  water: { color: "#6890F0", name: "Water" },
  electric: { color: "#F8D030", name: "Electric" },
  grass: { color: "#78C850", name: "Grass" },
  ice: { color: "#98D8D8", name: "Ice" },
  fighting: { color: "#C03028", name: "Fighting" },
  poison: { color: "#A040A0", name: "Poison" },
  ground: { color: "#E0C068", name: "Ground" },
  flying: { color: "#A890F0", name: "Flying" },
  psychic: { color: "#F85888", name: "Psychic" },
  bug: { color: "#A8B820", name: "Bug" },
  rock: { color: "#B8A038", name: "Rock" },
  ghost: { color: "#705898", name: "Ghost" },
  dragon: { color: "#7038F8", name: "Dragon" },
  dark: { color: "#705848", name: "Dark" },
  steel: { color: "#B8B8D0", name: "Steel" },
  fairy: { color: "#EE99AC", name: "Fairy" },
};

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
};

// App Configuration
export const APP_CONFIG = {
  NAME: "PokéBlog",
  VERSION: "1.0.0",
  DESCRIPTION: "Your Ultimate Pokémon Resource",
  AUTHOR: "PokéBlog Team",
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Featured Pokemon IDs for home page
export const FEATURED_POKEMON_IDS = [25, 1, 4, 7, 94, 144, 145, 146, 150, 151];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  NOT_FOUND: "Pokemon not found. Please check the name or ID.",
  INVALID_ID: "Please enter a valid Pokemon ID (1-1010).",
  SEARCH_EMPTY: "Please enter a Pokemon name or ID to search.",
  GENERIC: "Something went wrong. Please try again.",
  CACHE_ERROR: "Failed to cache data. The app may run slower.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FAVORITE_ADDED: "Added to favorites!",
  FAVORITE_REMOVED: "Removed from favorites.",
  FAVORITES_CLEARED: "All favorites cleared.",
  FAVORITES_EXPORTED: "Favorites exported successfully.",
  FAVORITES_IMPORTED: "Favorites imported successfully.",
};

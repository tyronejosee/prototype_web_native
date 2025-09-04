import { API_BASE_URL, ENDPOINTS } from "../utils/constants.js";

export class PokemonService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Get from cache or fetch
  async getCachedData(key, fetchFn) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  // Fetch Pokemon list with pagination
  async getPokemonList(offset = 0, limit = 20) {
    const cacheKey = `pokemon-list-${offset}-${limit}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.POKEMON}?offset=${offset}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
      }

      const data = await response.json();

      const pokemonWithDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const details = await this.getPokemonBasicDetails(pokemon.url);
            return {
              ...pokemon,
              id: details.id,
              types: details.types,
              sprites: details.sprites,
            };
          } catch (error) {
            console.warn(`Failed to fetch details for ${pokemon.name}:`, error);
            return pokemon;
          }
        })
      );

      return {
        ...data,
        results: pokemonWithDetails,
      };
    });
  }

  // Fetch Pokemon by ID or name
  async getPokemon(idOrName) {
    const cacheKey = `pokemon-${idOrName.toString().toLowerCase()}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.POKEMON}/${idOrName
          .toString()
          .toLowerCase()}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Pokemon "${idOrName}" not found`);
        }
        throw new Error(`Failed to fetch Pokemon: ${response.status}`);
      }

      const pokemon = await response.json();

      try {
        const speciesData = await this.getPokemonSpecies(pokemon.species.url);
        pokemon.species_data = speciesData;
      } catch (error) {
        console.warn("Failed to fetch species data:", error);
      }

      return pokemon;
    });
  }

  // Get basic Pokemon details from URL
  async getPokemonBasicDetails(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon details: ${response.status}`);
    }
    return response.json();
  }

  // Fetch Pokemon species data
  async getPokemonSpecies(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon species: ${response.status}`);
    }
    return response.json();
  }

  // Fetch Pokemon types
  async getPokemonTypes() {
    const cacheKey = "pokemon-types";

    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TYPE}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon types: ${response.status}`);
      }
      return response.json();
    });
  }

  // Fetch Pokemon by type
  async getPokemonByType(type) {
    const cacheKey = `pokemon-type-${type}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TYPE}/${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon by type: ${response.status}`);
      }

      const typeData = await response.json();

      const pokemonWithDetails = await Promise.all(
        typeData.pokemon.slice(0, 20).map(async (pokemonEntry) => {
          try {
            const details = await this.getPokemonBasicDetails(
              pokemonEntry.pokemon.url
            );
            return details;
          } catch (error) {
            console.warn(
              `Failed to fetch details for ${pokemonEntry.pokemon.name}:`,
              error
            );
            return pokemonEntry.pokemon;
          }
        })
      );

      return {
        ...typeData,
        pokemon: pokemonWithDetails,
      };
    });
  }

  // Get random Pokemon
  async getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    return this.getPokemon(randomId);
  }

  // Search Pokemon by name or ID
  async searchPokemon(query) {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      throw new Error("Please enter a Pokemon name or ID");
    }

    if (!isNaN(trimmedQuery)) {
      const id = parseInt(trimmedQuery);
      if (id < 1 || id > 1010) {
        throw new Error("Pokemon ID must be between 1 and 1010");
      }
      return this.getPokemon(id);
    }

    return this.getPokemon(trimmedQuery);
  }

  // Get evolution chain
  async getEvolutionChain(pokemon) {
    try {
      if (!pokemon.species_data || !pokemon.species_data.evolution_chain) {
        return [];
      }

      const evolutionUrl = pokemon.species_data.evolution_chain.url;
      const response = await fetch(evolutionUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch evolution chain");
      }

      const evolutionData = await response.json();
      const chain = this.parseEvolutionChain(evolutionData.chain);

      const chainWithDetails = await Promise.all(
        chain.map(async (pokemonName) => {
          try {
            return await this.getPokemon(pokemonName);
          } catch (error) {
            console.warn(
              `Failed to fetch evolution details for ${pokemonName}:`,
              error
            );
            return { name: pokemonName };
          }
        })
      );

      return chainWithDetails;
    } catch (error) {
      console.warn("Failed to get evolution chain:", error);
      return [];
    }
  }

  // Parse evolution chain recursively
  parseEvolutionChain(chain) {
    const result = [chain.species.name];

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution) => {
        result.push(...this.parseEvolutionChain(evolution));
      });
    }

    return result;
  }

  // Get featured Pokemon for home page
  async getFeaturedPokemon() {
    const featuredIds = [25, 1, 4, 7, 94, 144, 145, 146, 150, 151];

    const featuredPokemon = await Promise.all(
      featuredIds.map(async (id) => {
        try {
          return await this.getPokemon(id);
        } catch (error) {
          console.warn(`Failed to fetch featured Pokemon ${id}:`, error);
          return null;
        }
      })
    );
    return featuredPokemon.filter((pokemon) => pokemon !== null);
  }
}

export const pokemonService = new PokemonService();


const API_URL = "https://pokeapi.co/api/v2/pokemon"; 

// Function to call a Pokémon
export const fetchPokemons = async () => {
  try {
    const response = await fetch(API_URL); // PokeAPI Endpoint for Pokémon
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon");
    }
    const data = await response.json(); 
    return data.results; // Pokemon data are in "results"-Array
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    throw error;
  }
};

// Function to call a specific Pokémon
export const fetchPokemonDetails = async (pokemonName) => {
  try {
    const response = await fetch(`${API_URL}/${pokemonName}`); // Call a single Pokemon
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon details");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    throw error;
  }
};


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; 

// Function to call Pokemon(s)
export const fetchPokemons = async () => {
  try {
    const response = await fetch(`${API_URL}/pokemon`);
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon");
    }
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    throw error;
  }
};

// Function to add a Pokémon
export const addPokemon = async (pokemonData) => {
  try {
    const response = await fetch(`${API_URL}/pokemon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemonData),
    });

    if (!response.ok) {
      throw new Error("Failed to add Pokémon");
    }

    return await response.json(); // Returning added Pokémon
  } catch (error) {
    console.error("Error adding Pokémon:", error);
    throw error;
  }
};

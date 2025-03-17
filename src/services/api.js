// ==========================
// Julia's Code
// ==========================
const API_URL = "https://pokeapi.co/api/v2/pokemon"; 

// Function to fetch Pokémon
export const fetchPokemons = async () => {
  try {
    const response = await fetch(API_URL); // PokeAPI Endpoint for Pokémon
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon");
    }
    const data = await response.json(); 
    return data.results; // Pokémon data are in "results" array
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    throw error;
  }
};

// Function to fetch details of a specific Pokémon
export const fetchPokemonDetails = async (pokemonName) => {
  try {
    const response = await fetch(`${API_URL}/${pokemonName}`); // Fetch details of a single Pokémon
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

// ==========================
// Spencer's Code
// ==========================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Function to fetch wild Pokémon
export async function fetchWildPokemon() {
  const response = await fetch(`${API_BASE_URL}/pokemon/wild`);
  if (!response.ok) throw new Error('Failed to fetch wild pokemon');
  return response.json();
}

// Function to fetch player Pokémon by ID
export async function fetchPlayerPokemon(pokemonId) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonId}`);
  if (!response.ok) throw new Error('Failed to fetch player pokemon');
  return response.json();
}

// Function to update the stats of a Pokémon
export async function updatePokemonStats(pokemonId, stats) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  });
  if (!response.ok) throw new Error('Failed to update pokemon stats');
  return response.json();
}

// Function to record a battle result
export async function recordBattleResult(battleData) {
  const response = await fetch(`${API_BASE_URL}/battles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(battleData),
  });
  if (!response.ok) throw new Error('Failed to record battle result');
  return response.json();
}

// Function to update the leaderboard with user data
export async function updateLeaderboard(userData) {
  const response = await fetch(`${API_BASE_URL}/leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to update leaderboard');
  return response.json();
} 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function for API calls
const fetchWithError = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Get a random wild Pokemon
export const getWildPokemon = async () => {
  return fetchWithError(`${API_URL}/pokemon/wild`);
};

// Get Pokemon details
export const getPokemon = async (pokemonId) => {
  return fetchWithError(`${API_URL}/pokemon/${pokemonId}`);
};

// Update Pokemon stats after battle
export const updatePokemonStats = async (pokemonId, stats) => {
  return fetchWithError(`${API_URL}/pokemon/${pokemonId}`, {
    method: 'PATCH',
    body: JSON.stringify(stats),
  });
};

// Record battle result
export const recordBattle = async (battleData) => {
  return fetchWithError(`${API_URL}/battles`, {
    method: 'POST',
    body: JSON.stringify(battleData),
  });
};

// Get battle history for a user
export const getBattleHistory = async (userId) => {
  return fetchWithError(`${API_URL}/battles/user/${userId}`);
};

// Get battle statistics for a user
export const getBattleStats = async (userId) => {
  return fetchWithError(`${API_URL}/battles/stats/${userId}`);
}; 
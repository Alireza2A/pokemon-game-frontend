const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function for API calls
async function fetchWithError(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

// Get a random wild Pokemon for battle
export async function getWildPokemon() {
  return fetchWithError(`${API_BASE_URL}/pokemon/wild`);
}

// Get specific Pokemon details
export async function getPokemon(pokemonId) {
  return fetchWithError(`${API_BASE_URL}/pokemon/${pokemonId}`);
}

// Update Pokemon stats after battle
export async function updatePokemonStats(pokemonId, stats) {
  return fetchWithError(`${API_BASE_URL}/pokemon/${pokemonId}`, {
    method: 'PATCH',
    body: JSON.stringify(stats),
  });
}

// Record battle result
export async function recordBattle(battleData) {
  return fetchWithError(`${API_BASE_URL}/battles`, {
    method: 'POST',
    body: JSON.stringify(battleData),
  });
}

// Get battle history for a user
export async function getBattleHistory(userId) {
  return fetchWithError(`${API_BASE_URL}/battles/user/${userId}`);
}

// Get battle statistics for a user
export async function getBattleStats(userId) {
  return fetchWithError(`${API_BASE_URL}/battles/stats/${userId}`);
} 
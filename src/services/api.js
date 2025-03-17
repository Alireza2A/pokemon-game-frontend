const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchWildPokemon() {
  const response = await fetch(`${API_BASE_URL}/pokemon/wild`);
  if (!response.ok) throw new Error('Failed to fetch wild pokemon');
  return response.json();
}

export async function fetchPlayerPokemon(pokemonId) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonId}`);
  if (!response.ok) throw new Error('Failed to fetch player pokemon');
  return response.json();
}

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
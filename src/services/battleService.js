import axios from 'axios';

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
export const getWildPokemon = async (level) => {
  try {
    // Get a random Pokemon from our backend
    const response = await axios.get(`${API_URL}/battle/wild/${level || 5}`);
    const pokemonData = response.data;

    console.log('Received wild Pokemon data:', pokemonData); // Debug log

    // Ensure the moves are properly structured
    const moves = pokemonData.moves.map(move => ({
      move: {
        name: move.name,
        url: move.url || `https://pokeapi.co/api/v2/move/${move.id}/`
      }
    }));

    // Generate a temporary ID for wild Pokemon if none exists
    const wildPokemon = {
      id: pokemonData.id || pokemonData._id || `wild_${pokemonData.name}_${Date.now()}`,
      name: pokemonData.name,
      type: pokemonData.type,
      baseStats: pokemonData.baseStats,
      moves: moves,
      currentHp: pokemonData.baseStats.hp,
      level: level || 5,
      isWild: true,
      sprites: {
        front_default: pokemonData.sprites?.front_default || 
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id || pokemonData._id}.png`
      }
    };

    console.log('Formatted wild Pokemon:', wildPokemon); // Debug log
    return wildPokemon;
  } catch (error) {
    console.error('Error fetching wild Pokemon:', error);
    throw error;
  }
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
  try {
    console.log('Raw battle data received:', battleData); // Debug log

    // Ensure all required fields are present and properly formatted
    const formattedBattleData = {
      userId: battleData.userId,
      pokemonId: battleData.pokemonId,
      opponentPokemonId: battleData.opponentPokemonId,
      winner: battleData.winner,
      loser: battleData.loser,
      scoreChange: battleData.scoreChange,
      newScore: battleData.newScore,
      battleDuration: battleData.battleDuration,
      movesUsed: battleData.movesUsed.map(move => ({
        pokemonId: move.pokemon === 'user' ? battleData.pokemonId : battleData.opponentPokemonId,
        moveName: move.move,
        damage: move.damage
      })),
      statusEffects: battleData.statusEffects || []
    };

    console.log('Formatted battle data:', formattedBattleData); // Debug log
    
    // Add error handling for missing required fields
    if (!formattedBattleData.userId || !formattedBattleData.pokemonId || !formattedBattleData.opponentPokemonId) {
      console.error('Missing required fields:', {
        userId: formattedBattleData.userId,
        pokemonId: formattedBattleData.pokemonId,
        opponentPokemonId: formattedBattleData.opponentPokemonId
      });
      throw new Error('Missing required battle data fields');
    }

    const response = await axios.post(`${API_URL}/battle/record`, formattedBattleData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data) {
      throw new Error('No response data received from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error recording battle:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Request data:', error.config.data);
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to record battle');
    }
    if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
    }
    throw error;
  }
};

// Get battle history for a user
export const getBattleHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/battle/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching battle history:', error);
    throw error;
  }
};

// Get battle statistics for a user
export const getBattleStats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/battles/stats/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching battle stats:', error);
    throw error;
  }
};

export async function getMoveDetails(moveUrl) {
  try {
    const response = await fetch(moveUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch move details');
    }
    const moveData = await response.json();
    return {
      name: moveData.name.replace(/-/g, ' '),
      power: moveData.power || 40,
      type: moveData.type.name,
      accuracy: moveData.accuracy,
      pp: moveData.pp
    };
  } catch (error) {
    console.error('Error fetching move details:', error);
    return null;
  }
}
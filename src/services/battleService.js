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
    
    // Handle the response (debug logs)
    console.log('API URL:', `${API_URL}/battle/wild/${level || 5}`);
    console.log('Response status:', response.status);
    
    const pokemonData = response.data;
    console.log('Received wild Pokemon data:', pokemonData); // Debug log

    // Ensure the moves are properly structured
    const moves = pokemonData.moves ? pokemonData.moves.map(move => ({
      move: {
        name: move.name,
        url: move.url || `https://pokeapi.co/api/v2/move/${move.id || 1}/`
      }
    })) : [];

    // Generate a temporary ID for wild Pokemon if none exists
    const wildPokemon = {
      id: pokemonData.id || pokemonData._id || `wild_${pokemonData.name}_${Date.now()}`,
      name: pokemonData.name || 'Unknown Pokemon',
      type: pokemonData.type || ['normal'],
      baseStats: pokemonData.baseStats || {
        hp: 50,
        attack: 30,
        defense: 30,
        speed: 30
      },
      moves: moves.length > 0 ? moves : [
        { move: { name: 'tackle', url: 'https://pokeapi.co/api/v2/move/33/' } },
        { move: { name: 'growl', url: 'https://pokeapi.co/api/v2/move/45/' } }
      ],
      currentHp: (pokemonData.baseStats?.hp || 50),
      level: level || 5,
      isWild: true,
      sprites: {
        front_default: pokemonData.sprites?.front_default || 
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id || Math.floor(Math.random() * 151) + 1}.png`
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
    
    // Required fields for the backend
    const requiredFields = {
      pokemon_id: battleData.pokemonId,
      opponent_pokemon_id: battleData.opponentPokemonId,
      result: battleData.winner === 'user' ? 'win' : 'loss'
    };

    // Combine with any additional fields
    const formattedBattleData = {
      ...requiredFields,
      duration: battleData.battleDuration,
      moves_used: battleData.movesUsed,
      status_effects: battleData.statusEffects
    };

    console.log('Formatted battle data to send:', formattedBattleData);
    
    // Use the /start endpoint instead of /record
    const response = await axios.post(`${API_URL}/battle/start`, formattedBattleData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error recording battle:', error);
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

// Get battle stats
export const getBattleStats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/battle/stats/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
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
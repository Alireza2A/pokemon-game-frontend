import axios from 'axios';

// For Vite, use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getUserPokemons = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/pokemons`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user pokemons:', error);
    throw error;
  }
};

export const addPokemonToRoster = async (pokemonData) => {
  try {
    const response = await axios.post(`${API_URL}/user/pokemons`, pokemonData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error adding pokemon to roster:', error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}; 
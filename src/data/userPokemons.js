import { BASE_URL } from "../data/EventsApiURL";
import axios from "axios";
export const addPokemonPersistant = async (pokemon) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }
  const statValues = pokemon.stats
    .slice(0, 3)
    .map((statInfo) => Number(statInfo.base_stat));
  await axios.post(
    `${BASE_URL}/userPokemon/add`,
    {
      pokemon_id: pokemon.id,
      hp: statValues[0],
      attack: statValues[1],
      defense: statValues[2],
      speed: 100,
      level: 1,
      experience: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getUserPokemons = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/userPokemon`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Array of Pokémon
  } catch (error) {
    console.error("Error fetching roster:", error);
    return [];
  }
};

export const AfterBattle = async (battleInfo) => {
  //battleInfo should be like { pokemon_id, opponent_pokemon_id, result }
  try {
    const response = await axios.post(`${BASE_URL}/battle/start`, battleInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error reporting battle result:",
      error.response?.data || error.message
    );
    return null; // Return null or an error indicator
  }
};

export const getBattleResults = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/battle/results`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Returns the battle results array
  } catch (error) {
    console.error(
      "Error fetching battle results:",
      error.response?.data || error.message
    );
    return [];
  }
  // You will receive
  // const results = battles.map((battle) => ({
  // battle_id: battle.id,
  // user_pokemon: battle.userPokemon.name,
  // opponent_pokemon: battle.opponentPokemon.name,
  // result: battle.result,
  // points_awarded: battle.points_awarded,
  // battle_date: battle.battle_date,
  // user_pokemon_abilities: battle.userPokemonAbility.map((ability) => ({
  //  ability_id: ability.ability_id,
  //  effectiveness: ability.effectiveness,
  // })),
};

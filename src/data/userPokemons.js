import { BASE_URL } from "../data/EventsApiURL";
import axios from "axios";
export const addPokemonToRoster = async (pokemon) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Not authenticated");
    }
    const statValues = pokemon.stats.slice(0, 3).map((statInfo) => Number(statInfo.base_stat));
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
        }, // Ensure `pokemon` is defined
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

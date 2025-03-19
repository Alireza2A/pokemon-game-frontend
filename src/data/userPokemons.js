export const addPokemonToRoster = async (pokemon) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Not authenticated");
    }

    await axios.post(
        `${BASE_URL}/pokemon/select-starter`,
        { pokemonId: pokemon.id }, // Ensure `pokemon` is defined
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

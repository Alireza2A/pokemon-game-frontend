import { useRoster } from "../context/RosterContext";

const RosterButton = ({ pokemon, className = "" }) => {
  const { isPokemonInRoster, addPokemon, removePokemon } = useRoster();

  if (!pokemon) return null;

  const isInRoster = isPokemonInRoster(pokemon.id);

  const handleToggleRoster = () => {
    if (isInRoster) {
      removePokemon(pokemon.id);
    } else {
      addPokemon(pokemon);
    }
  };

  // Get primary type for styling
  const primaryType = pokemon.types[0]?.type?.name || "normal";

  // Type-based styling
  const typeStyles = {
    normal: "bg-gray-400 hover:bg-gray-500 text-white",
    fire: "bg-red-500 hover:bg-red-600 text-white",
    water: "bg-blue-500 hover:bg-blue-600 text-white",
    electric: "bg-yellow-400 hover:bg-yellow-500 text-gray-800",
    grass: "bg-green-500 hover:bg-green-600 text-white",
    ice: "bg-blue-300 hover:bg-blue-400 text-gray-800",
    fighting: "bg-red-700 hover:bg-red-800 text-white",
    poison: "bg-purple-500 hover:bg-purple-600 text-white",
    ground: "bg-yellow-600 hover:bg-yellow-700 text-white",
    flying: "bg-indigo-300 hover:bg-indigo-400 text-gray-800",
    psychic: "bg-pink-500 hover:bg-pink-600 text-white",
    bug: "bg-lime-500 hover:bg-lime-600 text-white",
    rock: "bg-yellow-700 hover:bg-yellow-800 text-white",
    ghost: "bg-purple-700 hover:bg-purple-800 text-white",
    dragon: "bg-indigo-600 hover:bg-indigo-700 text-white",
    dark: "bg-gray-700 hover:bg-gray-800 text-white",
    steel: "bg-gray-500 hover:bg-gray-600 text-white",
    fairy: "bg-pink-300 hover:bg-pink-400 text-gray-800",
  };

  const buttonStyle = isInRoster
    ? "bg-red-500 hover:bg-red-600 text-white"
    : typeStyles[primaryType] || "bg-blue-500 hover:bg-blue-600 text-white";

  return (
    <button
      onClick={handleToggleRoster}
      className={`px-5 py-2 rounded-lg font-medium transition-colors shadow-sm ${buttonStyle} ${className}`}
    >
      {isInRoster ? (
        <>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove from Roster
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Roster
          </span>
        </>
      )}
    </button>
  );
};

export default RosterButton;

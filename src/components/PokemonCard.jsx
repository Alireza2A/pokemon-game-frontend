import { Link } from "react-router-dom";
import { useRoster } from "../context/RosterContext";
import { useCaughtPokemon } from "../context/CaughtPokemonContext";

// Type colors for card borders
const typeColors = {
  normal: {
    bg: "bg-gray-300",
    border: "border-gray-400",
    text: "text-gray-800",
  },
  fire: { bg: "bg-red-400", border: "border-red-500", text: "text-white" },
  water: { bg: "bg-blue-400", border: "border-blue-500", text: "text-white" },
  electric: {
    bg: "bg-yellow-300",
    border: "border-yellow-400",
    text: "text-gray-800",
  },
  grass: {
    bg: "bg-green-400",
    border: "border-green-500",
    text: "text-gray-800",
  },
  ice: { bg: "bg-blue-200", border: "border-blue-300", text: "text-gray-800" },
  fighting: { bg: "bg-red-600", border: "border-red-700", text: "text-white" },
  poison: {
    bg: "bg-purple-400",
    border: "border-purple-500",
    text: "text-gray-800",
  },
  ground: {
    bg: "bg-yellow-600",
    border: "border-yellow-700",
    text: "text-white",
  },
  flying: {
    bg: "bg-indigo-300",
    border: "border-indigo-400",
    text: "text-gray-800",
  },
  psychic: { bg: "bg-pink-400", border: "border-pink-500", text: "text-white" },
  bug: { bg: "bg-lime-500", border: "border-lime-600", text: "text-white" },
  rock: { bg: "bg-stone-500", border: "border-stone-600", text: "text-white" },
  ghost: {
    bg: "bg-purple-600",
    border: "border-purple-700",
    text: "text-white",
  },
  dragon: {
    bg: "bg-indigo-600",
    border: "border-indigo-700",
    text: "text-white",
  },
  dark: { bg: "bg-gray-700", border: "border-gray-800", text: "text-white" },
  steel: { bg: "bg-gray-400", border: "border-gray-500", text: "text-white" },
  fairy: {
    bg: "bg-pink-300",
    border: "border-pink-400",
    text: "text-gray-800",
  },
  default: { bg: "bg-gray-400", border: "border-gray-500", text: "text-white" },
};

const PokemonCard = ({ pokemon, showActions = true, contextReady = true }) => {
  const rosterContext = useRoster();
  const caughtPokemonContext = useCaughtPokemon();

  // Safely destructure the contexts
  const {
    removePokemon = () => {},
    isPokemonInRoster = () => false,
    addPokemon = () => {},
  } = rosterContext || {};

  const { isPokemonCaught = () => false } = caughtPokemonContext || {};

  // Format Pokemon ID as #001, #025, etc.
  const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;

  // Get the proper image from the sprites
  const imageUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  // Capitalize Pokemon name
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Get primary type for card styling
  const primaryType = pokemon.types[0]?.type?.name || "default";
  const typeStyle = typeColors[primaryType] || typeColors.default;

  // Check if this pokemon is in the roster - only if context is ready
  const inRoster = contextReady ? isPokemonInRoster(pokemon.id) : false;

  // Check if this pokemon is caught - only if context is ready
  const isCaught = contextReady ? isPokemonCaught(pokemon.id) : false;

  // Handle toggling pokemon in roster
  const handleToggleRoster = () => {
    if (!contextReady) return;

    if (inRoster) {
      removePokemon(pokemon.id);
    } else {
      // Only allow adding caught pokemon to roster
      if (isCaught) {
        addPokemon(pokemon);
      } else {
        // Could show a toast message here
        alert("You can only add caught Pokémon to your roster!");
      }
    }
  };

  return (
    <div
      className={`group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
        typeStyle.border
      } bg-white ${contextReady && isCaught ? "ring-2 ring-yellow-400" : ""}`}
    >
      {/* Pokemon Image */}
      <div
        className={`relative h-40 p-4 flex items-center justify-center ${typeStyle.bg} bg-opacity-30`}
      >
        <span className="absolute top-2 left-2 text-sm text-gray-500 font-medium bg-white/80 px-2 py-0.5 rounded-full">
          {formattedId}
        </span>

        {/* Caught badge - only if context is ready */}
        {contextReady && isCaught && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            CAUGHT
          </div>
        )}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pokemon.name}
            className={`h-32 object-contain transition-transform group-hover:scale-110 ${
              contextReady && !isCaught ? "filter grayscale opacity-60" : ""
            }`}
          />
        ) : (
          <div className="h-32 w-32 flex items-center justify-center bg-gray-200 rounded-full">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Pokemon Details */}
      <div className="p-4">
        <h2 className="text-lg text-gray-800 font-bold mb-1 flex items-center">
          {capitalizedName}
          {contextReady && isCaught && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </h2>

        {/* Types */}
        <div className="flex gap-2 mb-3">
          {pokemon.types.map((typeInfo) => {
            const typeName = typeInfo.type.name;
            const style = typeColors[typeName] || typeColors.default;

            return (
              <span
                key={typeName}
                className={`${style.bg} ${style.text} text-xs font-medium px-2 py-1 rounded-full`}
              >
                {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
              </span>
            );
          })}
        </div>

        {/* Base Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {pokemon.stats.slice(0, 3).map((statInfo) => {
            const statName = statInfo.stat.name;
            const statValue = statInfo.base_stat;
            const displayName =
              {
                hp: "HP",
                attack: "ATK",
                defense: "DEF",
                "special-attack": "SP.ATK",
                "special-defense": "SP.DEF",
                speed: "SPD",
              }[statName] || statName.toUpperCase();

            // Calculate fill percentage (assume max is 150)
            const fillPercent = Math.min(100, (statValue / 150) * 100);

            return (
              <div key={statName}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{displayName}</span>
                  <span>{statValue}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStatColorClass(statValue)}`}
                    style={{ width: `${fillPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex justify-between gap-2">
            <Link
              to={`/pokemon/${pokemon.id}`}
              className={`flex-1 py-1.5 px-3 text-center text-sm font-medium rounded-md ${typeStyle.border} border text-gray-800 hover:bg-gray-50`}
            >
              Details
            </Link>

            {/* Only show caught/roster buttons if context is ready */}
            {contextReady ? (
              isCaught ? (
                <button
                  onClick={handleToggleRoster}
                  className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md ${
                    inRoster
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : `${typeStyle.bg} ${typeStyle.text} hover:opacity-90`
                  }`}
                >
                  {inRoster ? "Remove" : "Add to Roster"}
                </button>
              ) : (
                <button
                  className="flex-1 py-1.5 px-3 text-sm font-medium rounded-md bg-gray-300 text-gray-500 cursor-not-allowed"
                  disabled
                  title="You must catch this Pokémon first!"
                >
                  Not Caught
                </button>
              )
            ) : (
              <button
                className="flex-1 py-1.5 px-3 text-sm font-medium rounded-md bg-gray-300 text-gray-500"
                disabled
              >
                Loading...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get color class based on stat value
const getStatColorClass = (value) => {
  if (value >= 100) return "bg-green-500";
  if (value >= 70) return "bg-green-400";
  if (value >= 50) return "bg-yellow-400";
  if (value >= 30) return "bg-orange-400";
  return "bg-red-400";
};

export default PokemonCard;

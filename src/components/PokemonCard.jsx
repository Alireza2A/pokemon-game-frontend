import { Link } from "react-router";
import { useRoster } from "../context/RosterContext";

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
  grass: { bg: "bg-green-400", border: "border-green-500", text: "text-white" },
  ice: { bg: "bg-blue-200", border: "border-blue-300", text: "text-gray-800" },
  fighting: { bg: "bg-red-600", border: "border-red-700", text: "text-white" },
  poison: {
    bg: "bg-purple-400",
    border: "border-purple-500",
    text: "text-white",
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

const PokemonCard = ({ pokemon, showActions = true }) => {
  const { removePokemon, isPokemonInRoster, addPokemon } = useRoster();

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

  // Check if this pokemon is in the roster
  const inRoster = isPokemonInRoster(pokemon.id);

  // Handle toggling pokemon in roster
  const handleToggleRoster = () => {
    if (inRoster) {
      removePokemon(pokemon.id);
    } else {
      addPokemon(pokemon);
    }
  };

  return (
    <div
      className={`group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 ${typeStyle.border} bg-white`}
    >
      {/* Pokemon Image */}
      <div
        className={`relative h-40 p-4 flex items-center justify-center ${typeStyle.bg} bg-opacity-30`}
      >
        <span className="absolute top-2 left-2 text-sm text-gray-500 font-medium bg-white/80 px-2 py-0.5 rounded-full">
          {formattedId}
        </span>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pokemon.name}
            className="h-32 object-contain transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="h-32 w-32 flex items-center justify-center bg-gray-200 rounded-full">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Pokemon Details */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-1">{capitalizedName}</h2>

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

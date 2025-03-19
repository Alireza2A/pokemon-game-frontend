import { useEffect } from "react";

function PokemonStats({ pokemon, isPlayer, statusEffects = [] }) {
  const statusColors = {
    paralyzed: "text-yellow-400",
    burned: "text-orange-500",
    poisoned: "text-purple-500",
    asleep: "text-blue-500",
    frozen: "text-cyan-500",
    confused: "text-pink-500"
  };

  const typeColors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-400",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-700",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-600",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-400"
  };

  return (
    <div className={`p-4 rounded-lg ${isPlayer ? "bg-blue-100" : "bg-red-100"}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{pokemon.name}</h2>
        <div className="flex gap-1">
          <span className={`px-2 py-1 rounded text-white ${typeColors[pokemon.type]}`}>
            {pokemon.type}
          </span>
        </div>
      </div>

      {/* Status Effects */}
      {statusEffects.length > 0 && (
        <div className="mb-2">
          {statusEffects.map((effect, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-1 rounded-full text-sm mr-1 ${statusColors[effect]}`}
            >
              {effect}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Level:</span>
          <span>{pokemon.level}</span>
        </div>
        <div className="flex justify-between">
          <span>HP:</span>
          <span>
            {pokemon.currentHp}/{pokemon.maxHp}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Attack:</span>
          <span>{pokemon.attack}</span>
        </div>
        <div className="flex justify-between">
          <span>Defense:</span>
          <span>{pokemon.defense}</span>
        </div>
        <div className="flex justify-between">
          <span>Speed:</span>
          <span>{pokemon.speed}</span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              pokemon.currentHp / pokemon.maxHp > 0.5
                ? "bg-green-500"
                : pokemon.currentHp / pokemon.maxHp > 0.2
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${(pokemon.currentHp / pokemon.maxHp) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PokemonStats; 
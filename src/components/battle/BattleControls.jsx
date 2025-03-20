function BattleControls({ moves, onMoveSelect, isPlayerTurn, battleStatus }) {
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

  const statusColors = {
    paralyzed: "text-yellow-400",
    burned: "text-orange-500",
    poisoned: "text-purple-500",
    asleep: "text-blue-500",
    frozen: "text-cyan-500",
    confused: "text-pink-500"
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      {moves.map((move, index) => (
        <button
          key={index}
          onClick={() => onMoveSelect(move)}
          disabled={!isPlayerTurn || battleStatus !== "active"}
          className={`p-4 rounded-lg text-left transition-all ${
            !isPlayerTurn || battleStatus !== "active"
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 shadow-md"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{move.name}</span>
            <span className={`px-2 py-1 rounded text-white text-sm ${typeColors[move.type]}`}>
              {move.type}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{move.description}</div>
          <div className="flex justify-between text-sm">
            <span>Power: {move.power}</span>
            <span>Accuracy: {move.accuracy}%</span>
            {move.statusEffect && (
              <span className={`${statusColors[move.statusEffect]}`}>
                Status: {move.statusEffect}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default BattleControls; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoster } from "../context/RosterContext";
import BattleArena from "../components/battle/BattleArena";
import PokemonStats from "../components/battle/PokemonStats";
import BattleControls from "../components/battle/BattleControls";
import { getWildPokemon, updatePokemonStats, recordBattle } from "../services/battleService";

function BattlePage() {
  const navigate = useNavigate();
  const { roster, updateRoster } = useRoster();
  const [wildPokemon, setWildPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [battleState, setBattleState] = useState("select"); // select, battle, result
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWildPokemon = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const pokemon = await getWildPokemon();
        setWildPokemon(pokemon);
      } catch (error) {
        setError("Failed to fetch wild Pokemon. Please try again.");
        console.error("Error fetching wild Pokemon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWildPokemon();
  }, []);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
    setBattleState("battle");
  };

  const handleBattleEnd = async (result, battleData) => {
    try {
      setIsLoading(true);
      setError(null);

      const isVictory = result === "won";
      const experienceGained = isVictory ? 100 : 0;
      const newLevel = isVictory ? selectedPokemon.level + 1 : Math.max(1, selectedPokemon.level - 1);
      const newMaxHp = 100 + (newLevel - 1) * 5;

      // Update Pokemon stats
      const updatedPokemon = await updatePokemonStats(selectedPokemon.id, {
        currentHp: newMaxHp,
        level: newLevel,
        experience: selectedPokemon.experience + experienceGained
      });

      // Update roster with new Pokemon stats
      updateRoster(updatedPokemon);

      // Record battle result with additional battle data
      await recordBattle({
        userId: selectedPokemon.userId,
        playerPokemonId: selectedPokemon.id,
        wildPokemonId: wildPokemon.id,
        result: isVictory ? "won" : "lost",
        experienceGained,
        movesUsed: battleData.movesUsed,
        battleDuration: battleData.battleDuration,
        statusEffects: battleData.statusEffects
      });

      setBattleResult({
        winner: isVictory ? "player" : "wild",
        message: isVictory 
          ? "Victory! Your Pokemon leveled up!" 
          : "Defeat! Your Pokemon lost a level!"
      });
      setBattleState("result");
    } catch (error) {
      setError("Failed to process battle result. Please try again.");
      console.error("Error processing battle result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnToRoster = () => {
    navigate("/roster");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Battle Arena</h1>
      
      {battleState === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roster.map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handlePokemonSelect(pokemon)}
            >
              <h2 className="text-2xl font-semibold mb-4">{pokemon.name}</h2>
              <PokemonStats pokemon={pokemon} />
            </div>
          ))}
        </div>
      )}

      {battleState === "battle" && selectedPokemon && wildPokemon && (
        <BattleArena
          playerPokemon={selectedPokemon}
          wildPokemon={wildPokemon}
          onBattleEnd={handleBattleEnd}
        />
      )}

      {battleState === "result" && battleResult && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {battleResult.winner === "player" ? "Victory!" : "Defeat"}
          </h2>
          <p className="text-xl mb-8">{battleResult.message}</p>
          <button
            onClick={handleReturnToRoster}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Roster
          </button>
        </div>
      )}
    </div>
  );
}

export default BattlePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRoster } from "../context/RosterContext";
import BattleArena from "../components/battle/BattleArena";
import PokemonStats from "../components/battle/PokemonStats";
import BattleControls from "../components/battle/BattleControls";
import { getWildPokemon, recordBattle } from "../services/battleService";

const BattlePage = () => {
  const navigate = useNavigate();
  const { roster, updateRoster } = useRoster();
  const [wildPokemon, setWildPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [battleState, setBattleState] = useState("select"); // select, battle, result
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWildPokemon = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Get a random level between 1 and 10 for the wild Pokemon
        const randomLevel = Math.floor(Math.random() * 10) + 1;
        const pokemon = await getWildPokemon(randomLevel);
        setWildPokemon(pokemon);
      } catch (err) {
        console.error('Error fetching wild Pokemon:', err);
        setError('Failed to fetch wild Pokemon. Please try again.');
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

  const handleBattleEnd = async (battleData) => {
    try {
      if (!selectedPokemon || !wildPokemon) {
        throw new Error('Missing Pokemon data');
      }

      console.log('Selected Pokemon:', selectedPokemon); // Debug log
      console.log('Wild Pokemon:', wildPokemon); // Debug log

      // Calculate score change (example: +10 for win, -5 for loss)
      const scoreChange = battleData.winner === 'user' ? '+10' : '-5';
      
      // Get current user score from context or localStorage
      const currentScore = parseInt(localStorage.getItem('userScore') || '0');
      const newScore = battleData.winner === 'user' ? currentScore + 10 : currentScore - 5;
      
      // Format moves used data
      const formattedMovesUsed = battleData.movesUsed.map(move => ({
        pokemon: move.pokemon === selectedPokemon.name ? 'user' : 'opponent',
        move: move.move,
        damage: move.damage
      }));

      // For wild Pokemon, we'll use a special identifier
      const opponentPokemonId = wildPokemon.isWild ? 
        `wild_${wildPokemon.name}_${wildPokemon.level}` : 
        wildPokemon.id;

      const battleRecordData = {
        userId: 1, // This should come from your auth context
        pokemonId: selectedPokemon.id,
        opponentPokemonId: opponentPokemonId,
        winner: battleData.winner,
        loser: battleData.loser,
        scoreChange,
        newScore,
        battleDuration: battleData.battleDuration || 0,
        movesUsed: formattedMovesUsed,
        statusEffects: battleData.statusEffects || []
      };

      console.log('Battle record data:', battleRecordData); // Debug log

      // Validate required fields
      if (!battleRecordData.pokemonId || !battleRecordData.opponentPokemonId) {
        console.error('Missing Pokemon IDs:', {
          selectedPokemonId: battleRecordData.pokemonId,
          wildPokemonId: battleRecordData.opponentPokemonId
        });
        throw new Error('Missing Pokemon IDs');
      }

      const result = await recordBattle(battleRecordData);
      
      // Update user's score in localStorage
      localStorage.setItem('userScore', newScore.toString());
      
      setBattleState("result");
      setBattleResult(result);
    } catch (error) {
      console.error('Error recording battle:', error);
      setError('Failed to record battle result: ' + error.message);
    }
  };

  const handleReturnToRoster = () => {
    navigate("/leaderboard");
  };

  if (isLoading) return <div>Loading battle...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!wildPokemon) return <div>No wild Pokemon available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Battle Arena</h1>
      {battleState === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Pokemon</h2>
            <div className="grid grid-cols-1 gap-2">
              {roster.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handlePokemonSelect(pokemon)}
                  className="p-4 border rounded-lg hover:bg-gray-100"
                >
                  <PokemonStats pokemon={pokemon} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Wild Pokemon</h2>
            <PokemonStats pokemon={wildPokemon} />
          </div>
        </div>
      )}
      {battleState === "battle" && selectedPokemon && (
        <BattleArena
          userPokemon={selectedPokemon}
          wildPokemon={wildPokemon}
          onBattleEnd={handleBattleEnd}
        />
      )}
      {battleState === "result" && battleResult && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {battleResult.winner === "user" ? "Victory!" : "Defeat"}
          </h2>
          <button
            onClick={handleReturnToRoster}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Roster
          </button>
        </div>
      )}
    </div>
  );
};

export default BattlePage;

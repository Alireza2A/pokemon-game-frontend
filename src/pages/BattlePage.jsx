import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRoster } from "../context/RosterContext";
import BattleArena from "../components/battle/BattleArena";
import PokemonStats from "../components/battle/PokemonStats";
import BattleControls from "../components/battle/BattleControls";
import { getWildPokemon, recordBattle, getMoveDetails } from "../services/battleService";

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
        
        // Ensure the wild Pokemon data has the correct structure
        // This is important for consistency between selection and battle
        const formattedPokemon = {
          ...pokemon,
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          baseStats: pokemon.baseStats || {
            hp: pokemon?.stats?.[0]?.base_stat || 50,
            attack: pokemon?.stats?.[1]?.base_stat || 30,
            defense: pokemon?.stats?.[2]?.base_stat || 30,
            speed: pokemon?.stats?.[5]?.base_stat || 30
          },
          // Ensure type is consistently formatted
          type: Array.isArray(pokemon.type) ? pokemon.type : [pokemon.type || 'normal'],
          types: Array.isArray(pokemon.types) ? pokemon.types : 
                 [{ type: { name: Array.isArray(pokemon.type) ? pokemon.type[0] : (pokemon.type || 'normal') } }]
        };
        
        console.log('Formatted wild Pokemon for selection:', formattedPokemon);
        setWildPokemon(formattedPokemon);
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
    // Ensure the selected Pokemon has consistent structure
    const formattedPokemon = {
      ...pokemon,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      baseStats: pokemon.baseStats || {
        hp: pokemon?.stats?.[0]?.base_stat || 50,
        attack: pokemon?.stats?.[1]?.base_stat || 30, 
        defense: pokemon?.stats?.[2]?.base_stat || 30,
        speed: pokemon?.stats?.[5]?.base_stat || 30
      },
      // Ensure type is consistently formatted
      type: Array.isArray(pokemon.type) ? pokemon.type : [pokemon.type || 'normal'],
      types: Array.isArray(pokemon.types) ? pokemon.types : 
             [{ type: { name: Array.isArray(pokemon.type) ? pokemon.type[0] : (pokemon.type || 'normal') } }]
    };
    
    console.log('Formatted selected Pokemon for battle:', formattedPokemon);
    setSelectedPokemon(formattedPokemon);
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

      try {
        // Try to record the battle, but don't block progression if it fails
        const result = await recordBattle(battleRecordData);
        console.log('Battle record result:', result);
      } catch (recordError) {
        console.error('Error recording battle, continuing anyway:', recordError);
        // Continue with the flow even if battle recording fails
      }
      
      // Update user's score in localStorage (do this regardless of API success)
      localStorage.setItem('userScore', newScore.toString());
      
      // Store battle result in session storage to display on leaderboard
      sessionStorage.setItem('lastBattleResult', JSON.stringify({
        winner: battleData.winner,
        pokemonName: selectedPokemon.name,
        opponentName: wildPokemon.name,
        scoreChange: scoreChange
      }));
      
      // Navigate to leaderboard immediately after battle is recorded
      navigate('/leaderboard');
    } catch (error) {
      console.error('Error processing battle end:', error);
      setError('Failed to process battle result: ' + error.message);
      
      // Still attempt to navigate to leaderboard after a short delay
      setTimeout(() => {
        navigate('/leaderboard');
      }, 3000);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Your Pokémon</h2>
            <div className="grid grid-cols-1 gap-4">
              {roster.map((pokemon) => (
                <div key={pokemon.id} 
                     className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
                     onClick={() => handlePokemonSelect(pokemon)}>
                  <div className="flex items-start p-4">
                    <div className="w-1/3 bg-blue-50 rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={pokemon.sprites?.front_default || "/placeholder-pokemon.png"}
                        alt={pokemon.name}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <div className="w-2/3 pl-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold capitalize">{pokemon.name}</h3>
                        <div className="bg-yellow-100 px-2 py-1 rounded text-xs font-semibold">
                          #{pokemon.id?.toString().padStart(3, '0') || '???'}
                        </div>
                      </div>
                      <div className="flex gap-2 mb-2">
                        {pokemon.type && Array.isArray(pokemon.type) ? (
                          pokemon.type.map((t, idx) => (
                            <span key={idx} className={`px-2 py-1 rounded text-white text-xs bg-blue-500`}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">
                            {pokemon.type || 'Normal'}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold">HP:</span>
                          <span>{pokemon.baseStats?.hp || '??'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">ATK:</span>
                          <span>{pokemon.baseStats?.attack || '??'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">DEF:</span>
                          <span>{pokemon.baseStats?.defense || '??'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">SPD:</span>
                          <span>{pokemon.baseStats?.speed || '??'}</span>
                        </div>
                      </div>
                      <button
                        className="mt-3 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePokemonSelect(pokemon);
                        }}
                      >
                        Select for Battle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-700 border-b pb-2">Wild Pokémon</h2>
            {wildPokemon ? (
              <div className="border rounded-lg overflow-hidden shadow-md bg-white">
                <div className="bg-red-50 p-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold capitalize">{wildPokemon.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Level:</span>
                    <span className="bg-red-100 px-2 py-1 rounded text-red-800 font-bold">{wildPokemon.level}</span>
                  </div>
                </div>
                <div className="flex p-4">
                  <div className="w-1/3 bg-red-50 rounded-lg p-2 flex items-center justify-center">
                    <img
                      src={wildPokemon.sprites?.front_default || "/placeholder-pokemon.png"}
                      alt={wildPokemon.name}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="w-2/3 pl-4">
                    <div className="flex gap-2 mb-3">
                      {wildPokemon.type && Array.isArray(wildPokemon.type) ? (
                        wildPokemon.type.map((t, idx) => (
                          <span key={idx} className={`px-2 py-1 rounded text-white text-xs bg-red-500`}>
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 rounded text-white text-xs bg-red-500">
                          {wildPokemon.type || 'Normal'}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500 text-xs">HP</div>
                        <div className="font-bold">{wildPokemon.baseStats?.hp}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min((wildPokemon.baseStats?.hp || 50) / 150 * 100, 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500 text-xs">ATTACK</div>
                        <div className="font-bold">{wildPokemon.baseStats?.attack}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.min((wildPokemon.baseStats?.attack || 50) / 150 * 100, 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500 text-xs">DEFENSE</div>
                        <div className="font-bold">{wildPokemon.baseStats?.defense}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((wildPokemon.baseStats?.defense || 50) / 150 * 100, 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500 text-xs">SPEED</div>
                        <div className="font-bold">{wildPokemon.baseStats?.speed}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${Math.min((wildPokemon.baseStats?.speed || 50) / 150 * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-red-100 p-2 rounded-md text-sm">
                      <p className="font-semibold text-red-800">Wild Pokémon!</p>
                      <p className="text-gray-700">Defeat this Pokémon to gain experience and climb the leaderboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Searching for wild Pokémon...</p>
                </div>
              </div>
            )}
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

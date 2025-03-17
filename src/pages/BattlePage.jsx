'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'react-router-dom';
import { useRoster } from '../context/RosterContext';
import { fetchWildPokemon, fetchPlayerPokemon, updatePokemonStats, recordBattleResult, updateLeaderboard } from '../services/api';

export default function BattlePage() {
  const router = useRouter();
  const { activePokemon, updateRoster } = useRoster();
  
  const [battleState, setBattleState] = useState({
    isLoading: true,
    isPlayerTurn: true,
    isBattleOver: false,
    battleLog: [],
    result: null
  });

  const [playerPokemon, setPlayerPokemon] = useState({
    id: '',
    name: '',
    level: 1,
    maxHp: 100,
    currentHp: 100,
    moves: [],
    experience: 0
  });

  const [wildPokemon, setWildPokemon] = useState({
    id: '',
    name: '',
    level: 1,
    maxHp: 100,
    currentHp: 100,
    moves: []
  });

  useEffect(() => {
    if (!activePokemon) {
      router.push('/my-roster');
      return;
    }
    initializeBattle();
  }, [activePokemon]);

  const initializeBattle = async () => {
    try {
      const [wildPokemonData, playerPokemonData] = await Promise.all([
        fetchWildPokemon(),
        fetchPlayerPokemon(activePokemon.id)
      ]);

      setWildPokemon({
        ...wildPokemonData,
        currentHp: wildPokemonData.maxHp
      });

      setPlayerPokemon({
        ...playerPokemonData,
        currentHp: playerPokemonData.maxHp
      });

      setBattleState(prev => ({ 
        ...prev, 
        isLoading: false,
        battleLog: [`A wild ${wildPokemonData.name} appeared!`]
      }));
    } catch (error) {
      console.error('Failed to initialize battle:', error);
      setBattleState(prev => ({ 
        ...prev, 
        battleLog: [...prev.battleLog, 'Error initializing battle!']
      }));
    }
  };

  const calculateDamage = (attacker, defender, move) => {
    const levelFactor = attacker.level / 5 + 2;
    const attackDefenseRatio = 1; // Simplified for now
    const baseDamage = ((levelFactor * move.power * attackDefenseRatio) / 50) + 2;
    
    // Random factor between 0.85 and 1.0
    const randomFactor = 0.85 + Math.random() * 0.15;
    
    return Math.floor(baseDamage * randomFactor);
  };

  const handleAttack = async (moveId) => {
    if (!battleState.isPlayerTurn || battleState.isBattleOver) return;

    try {
      // Player's turn
      const selectedMove = playerPokemon.moves.find(move => move.id === moveId);
      const damage = calculateDamage(playerPokemon, wildPokemon, selectedMove);
      
      const newWildHp = Math.max(0, wildPokemon.currentHp - damage);
      setWildPokemon(prev => ({
        ...prev,
        currentHp: newWildHp
      }));

      setBattleState(prev => ({
        ...prev,
        isPlayerTurn: false,
        battleLog: [...prev.battleLog, `${playerPokemon.name} used ${selectedMove.name}! Dealt ${damage} damage!`]
      }));

      // Check if wild Pokemon fainted
      if (newWildHp === 0) {
        handleBattleEnd('win');
        return;
      }

      // Wild Pokemon's turn
      setTimeout(async () => {
        const wildMoves = wildPokemon.moves;
        const randomMove = wildMoves[Math.floor(Math.random() * wildMoves.length)];
        const wildDamage = calculateDamage(wildPokemon, playerPokemon, randomMove);
        
        const newPlayerHp = Math.max(0, playerPokemon.currentHp - wildDamage);
        setPlayerPokemon(prev => ({
          ...prev,
          currentHp: newPlayerHp
        }));

        setBattleState(prev => ({
          ...prev,
          isPlayerTurn: true,
          battleLog: [...prev.battleLog, `Wild ${wildPokemon.name} used ${randomMove.name}! Dealt ${wildDamage} damage!`]
        }));

        // Check if player Pokemon fainted
        if (newPlayerHp === 0) {
          handleBattleEnd('loss');
        }
      }, 1000);

    } catch (error) {
      console.error('Attack failed:', error);
      setBattleState(prev => ({
        ...prev,
        battleLog: [...prev.battleLog, 'Attack failed!']
      }));
    }
  };

  const handleBattleEnd = async (result) => {
    try {
      const battleData = {
        playerPokemonId: playerPokemon.id,
        wildPokemonId: wildPokemon.id,
        result,
        playerPokemonLevel: playerPokemon.level
      };

      // Record battle result
      await recordBattleResult(battleData);

      if (result === 'win') {
        // Update Pokemon stats
        const newLevel = playerPokemon.level + 1;
        const newStats = {
          level: newLevel,
          maxHp: 100 + (newLevel - 1) * 5, // 5 HP per level
          experience: playerPokemon.experience + 1
        };

        await updatePokemonStats(playerPokemon.id, newStats);
        await updateRoster(); // Update the roster context
      } else {
        // Handle loss - decrease level if above 1
        if (playerPokemon.level > 1) {
          const newStats = {
            level: playerPokemon.level - 1,
            maxHp: 100 + (playerPokemon.level - 2) * 5
          };
          await updatePokemonStats(playerPokemon.id, newStats);
          await updateRoster();
        }
      }

      // Update leaderboard
      await updateLeaderboard({
        result,
        pokemonId: playerPokemon.id
      });

      setBattleState(prev => ({
        ...prev,
        isBattleOver: true,
        result,
        battleLog: [...prev.battleLog, result === 'win' ? 'Victory! Your Pokemon leveled up!' : 'Defeat! Your Pokemon lost a level!']
      }));
    } catch (error) {
      console.error('Failed to process battle end:', error);
      setBattleState(prev => ({
        ...prev,
        battleLog: [...prev.battleLog, 'Error processing battle result!']
      }));
    }
  };

  if (battleState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Battle Arena Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between mb-8">
            {/* Wild Pokemon Stats */}
            <div className="w-1/3">
              <h2 className="text-xl font-bold mb-2">Wild {wildPokemon.name}</h2>
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 rounded-full h-4"
                  style={{ width: `${(wildPokemon.currentHp / wildPokemon.maxHp) * 100}%` }}
                ></div>
              </div>
              <p className="mt-1">Level: {wildPokemon.level}</p>
            </div>

            {/* Player Pokemon Stats */}
            <div className="w-1/3 text-right">
              <h2 className="text-xl font-bold mb-2">{playerPokemon.name}</h2>
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 rounded-full h-4"
                  style={{ width: `${(playerPokemon.currentHp / playerPokemon.maxHp) * 100}%` }}
                ></div>
              </div>
              <p className="mt-1">Level: {playerPokemon.level}</p>
            </div>
          </div>

          {/* Battle Controls */}
          <div className="mt-8">
            {!battleState.isBattleOver ? (
              <div className="grid grid-cols-2 gap-4">
                {playerPokemon.moves.map((move) => (
                  <button
                    key={move.id}
                    onClick={() => handleAttack(move.id)}
                    disabled={!battleState.isPlayerTurn}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {move.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  {battleState.result === 'win' ? 'Victory!' : 'Defeat!'}
                </h3>
                <button
                  onClick={() => router.push('/my-roster')}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Return to Roster
                </button>
              </div>
            )}
          </div>

          {/* Battle Log */}
          <div className="mt-8 h-32 overflow-y-auto bg-gray-100 p-4 rounded">
            {battleState.battleLog.map((log, index) => (
              <p key={index} className="mb-1">{log}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
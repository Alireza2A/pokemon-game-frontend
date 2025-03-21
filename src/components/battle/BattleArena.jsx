import React, { useState, useEffect } from 'react';
import { getWildPokemon, getMoveDetails } from '../../services/battleService';
import PokemonStats from "./PokemonStats";

// Type effectiveness chart
const TYPE_EFFECTIVENESS = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5 },
  ice: { water: 0.5, grass: 2, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, dragon: 2 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, dragon: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, dark: 2, steel: 0.5, dragon: 2 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, dragon: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Status effect definitions
const STATUS_EFFECTS = {
  paralyzed: { name: "Paralyzed", speed: 0.5, canMove: 0.75 },
  burned: { name: "Burned", attack: 0.5, damagePerTurn: 0.1 },
  poisoned: { name: "Poisoned", damagePerTurn: 0.1 },
  asleep: { name: "Asleep", canMove: 0 },
  frozen: { name: "Frozen", canMove: 0 },
  confused: { name: "Confused", selfDamageChance: 0.33 }
};

const DEFAULT_MOVES = [
  { name: 'Tackle', power: 40, type: 'normal' },
  { name: 'Scratch', power: 40, type: 'normal' }
];

const DEFAULT_STATS = {
  hp: 100,
  attack: 50,
  defense: 50,
  speed: 50,
  level: 5  // Add default level
};

function getMoveTypeColor(type) {
  const typeColors = {
    normal: 'gray',
    fire: 'red',
    water: 'blue',
    electric: 'yellow',
    grass: 'green',
    ice: 'cyan',
    fighting: 'red',
    poison: 'purple',
    ground: 'yellow',
    flying: 'blue',
    psychic: 'pink',
    bug: 'green',
    rock: 'yellow',
    ghost: 'purple',
    dragon: 'purple',
    dark: 'gray',
    steel: 'gray',
    fairy: 'pink'
  };
  
  return typeColors[type?.toLowerCase()] || 'blue';
}

const BattleArena = ({ userPokemon, wildPokemon, onBattleEnd }) => {
  console.log('Initial userPokemon data:', userPokemon); // Log initial prop data
  console.log('Initial wildPokemon data:', wildPokemon); // Log initial wild Pokemon data

  const [battleLog, setBattleLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set to true while fetching move details
  const [error, setError] = useState(null);
  const [battleStartTime] = useState(Date.now());
  const [battleState, setBattleState] = useState('active');
  const [currentTurn, setCurrentTurn] = useState('user');

  // Initialize user Pokemon state with default values if needed
  const [userPokemonState, setUserPokemonState] = useState(() => {
    const baseStats = userPokemon.baseStats || {
      hp: userPokemon?.stats?.[0]?.base_stat || DEFAULT_STATS.hp,
      attack: userPokemon?.stats?.[1]?.base_stat || DEFAULT_STATS.attack,
      defense: userPokemon?.stats?.[2]?.base_stat || DEFAULT_STATS.defense,
      speed: userPokemon?.stats?.[5]?.base_stat || DEFAULT_STATS.speed
    };

    // Initialize with basic move data first
    const initialState = {
      id: userPokemon?.id,
      name: userPokemon?.name?.charAt(0).toUpperCase() + userPokemon?.name?.slice(1) || 'Your Pokemon',
      baseStats,
      currentHp: baseStats.hp,
      maxHp: baseStats.hp,
      attack: baseStats.attack,
      defense: baseStats.defense,
      speed: baseStats.speed,
      level: userPokemon?.level || DEFAULT_STATS.level,
      moves: DEFAULT_MOVES,
      types: userPokemon?.types?.map(type => type.type.name) || ['normal'],
      statusEffects: []
    };

    return initialState;
  });

  // Initialize wild Pokemon state with data passed from the parent component
  const [wildPokemonState, setWildPokemonState] = useState(() => {
    const baseStats = wildPokemon.baseStats || {
      hp: wildPokemon?.stats?.[0]?.base_stat || DEFAULT_STATS.hp,
      attack: wildPokemon?.stats?.[1]?.base_stat || DEFAULT_STATS.attack,
      defense: wildPokemon?.stats?.[2]?.base_stat || DEFAULT_STATS.defense,
      speed: wildPokemon?.stats?.[5]?.base_stat || DEFAULT_STATS.speed
    };

    return {
      id: wildPokemon?.id,
      name: wildPokemon?.name?.charAt(0).toUpperCase() + wildPokemon?.name?.slice(1) || 'Wild Pokemon',
      baseStats,
      currentHp: baseStats.hp,
      maxHp: baseStats.hp,
      attack: baseStats.attack,
      defense: baseStats.defense,
      speed: baseStats.speed,
      level: wildPokemon?.level || DEFAULT_STATS.level,
      moves: DEFAULT_MOVES, // Will be updated with actual moves
      types: wildPokemon?.type || wildPokemon?.types?.map(type => type.type.name) || ['normal'],
      statusEffects: []
    };
  });

  // Fetch detailed move data for user Pokemon
  useEffect(() => {
    const fetchMoveDetails = async () => {
      try {
        console.log('Fetching move details for user Pokemon...');
        const moves = userPokemon?.moves || [];
        const selectedMoves = moves.slice(0, 4);
        
        if (selectedMoves.length === 0) {
          console.warn('No moves found for user Pokemon, using defaults');
          setUserPokemonState(prev => ({ ...prev, moves: DEFAULT_MOVES }));
          return;
        }

        const movesWithDetails = await Promise.all(
          selectedMoves.map(async (moveData) => {
            try {
              if (!moveData?.move?.url) {
                console.warn('Move URL not found:', moveData);
                return DEFAULT_MOVES[0];
              }

              const moveDetails = await getMoveDetails(moveData.move.url);
              return {
                name: moveDetails?.name?.replace(/-/g, ' ') || 'Tackle',
                power: moveDetails?.power || 40,
                type: moveDetails?.type?.name || 'normal'
              };
            } catch (error) {
              console.error('Error fetching move details:', error);
              return DEFAULT_MOVES[0];
            }
          })
        );

        console.log('User Pokemon moves with details:', movesWithDetails);
        setUserPokemonState(prev => ({ ...prev, moves: movesWithDetails }));
      } catch (err) {
        console.error('Error fetching move details for user Pokemon:', err);
        setUserPokemonState(prev => ({ ...prev, moves: DEFAULT_MOVES }));
      }
    };

    fetchMoveDetails();
  }, [userPokemon]);

  // Fetch detailed move data for wild Pokemon
  useEffect(() => {
    const fetchWildPokemonMoveDetails = async () => {
      try {
        console.log('Fetching move details for wild Pokemon...');
        setIsLoading(true);
        
        // Check if the wild Pokémon has moves
        if (!wildPokemon?.moves || !Array.isArray(wildPokemon.moves) || wildPokemon.moves.length === 0) {
          console.warn('No moves found for wild Pokemon, using default move set');
          // Create default moves based on the Pokémon's type
          const type = wildPokemon?.type?.[0] || wildPokemon?.types?.[0]?.type?.name || 'normal';
          
          // Generate a type-appropriate default move
          const defaultTypeMove = {
            name: `${type} attack`,
            power: 40,
            type: type
          };
          
          // Set default moves including a type-based move
          const defaultMoves = [
            defaultTypeMove,
            { name: 'tackle', power: 35, type: 'normal' },
            { name: 'growl', power: 0, type: 'normal' },
            { name: 'tail whip', power: 0, type: 'normal' }
          ];
          
          setWildPokemonState(prev => ({ ...prev, moves: defaultMoves }));
          setIsLoading(false);
          return;
        }

        const selectedMoves = wildPokemon.moves.slice(0, 4);
        
        const movesWithDetails = await Promise.all(
          selectedMoves.map(async (moveData) => {
            try {
              if (!moveData?.move?.url) {
                console.warn('Wild Pokemon move URL not found:', moveData);
                return DEFAULT_MOVES[0];
              }

              const moveDetails = await getMoveDetails(moveData.move.url);
              return {
                name: moveDetails?.name?.replace(/-/g, ' ') || 'Tackle',
                power: moveDetails?.power || 40,
                type: moveDetails?.type?.name || 'normal'
              };
            } catch (error) {
              console.error('Error fetching wild Pokemon move details:', error);
              return DEFAULT_MOVES[0];
            }
          })
        );

        console.log('Wild Pokemon moves with details:', movesWithDetails);
        setWildPokemonState(prev => ({ ...prev, moves: movesWithDetails }));
      } catch (err) {
        console.error('Error fetching move details for wild Pokemon:', err);
        setWildPokemonState(prev => ({ ...prev, moves: DEFAULT_MOVES }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWildPokemonMoveDetails();
  }, [wildPokemon]);

  // Add this damage calculation function near the other utility functions
  const calculateMoveDamage = (attacker, defender, move) => {
    // Base formula similar to Pokemon games:
    // Damage = (((2 * level * effectiveAttack * movePower) / (50 * effectiveDefense)) + 2)
    
    const level = attacker.level || 5;
    const attackStat = attacker.baseStats.attack;
    const defenseStat = defender.baseStats.defense;
    const movePower = move.power || 40;
    
    // Calculate type effectiveness
    let typeMultiplier = 1;
    if (move.type && defender.types && TYPE_EFFECTIVENESS[move.type]) {
      defender.types.forEach(defenderType => {
        if (TYPE_EFFECTIVENESS[move.type][defenderType]) {
          typeMultiplier *= TYPE_EFFECTIVENESS[move.type][defenderType];
        }
      });
    }

    // Main damage formula
    const baseDamage = Math.floor(
      (((2 * level * attackStat * movePower) / (50 * defenseStat)) + 2) * typeMultiplier
    );

    return baseDamage;
  };

  const handleAttack = (move) => {
    if (battleState === 'finished' || !wildPokemonState) return;
    
    console.log('Attack initiated with move:', move);
    console.log('Current userPokemonState:', userPokemonState);
    console.log('Current wildPokemonState:', wildPokemonState);

    if (currentTurn === 'user') {
      // Calculate damage using the new formula
      const damage = calculateMoveDamage(userPokemonState, wildPokemonState, move);
      
      // User's turn
      const newHp = Math.max(0, wildPokemonState.currentHp - damage);
      setWildPokemonState(prev => ({ ...prev, currentHp: newHp }));
      const battleMessage = `${userPokemonState.name} used ${move?.name || 'Tackle'}! Dealt ${damage} damage.`;
      console.log('Battle log message:', battleMessage);
      setBattleLog(prev => [...prev, battleMessage]);

      if (newHp === 0) {
        setBattleState('finished');
        onBattleEnd({ 
          winner: 'user', 
          loser: 'opponent',
          battleDuration: Date.now() - battleStartTime,
          movesUsed: battleLog.map(log => ({
            pokemon: userPokemonState.name,
            move: move.name,
            damage: damage
          })),
          statusEffects: [] // Add any status effects if implemented
        });
      } else {
        setCurrentTurn('opponent');
      }
    }
  };

  // Update opponent's turn to use the same damage calculation
  useEffect(() => {
    if (currentTurn === 'opponent' && battleState === 'active' && wildPokemonState) {
      const timer = setTimeout(() => {
        const moves = wildPokemonState.moves || [{ name: 'Tackle', power: 40 }];
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        
        const damage = calculateMoveDamage(wildPokemonState, userPokemonState, randomMove);
        const newHp = Math.max(0, userPokemonState.currentHp - damage);

        setUserPokemonState(prev => ({ ...prev, currentHp: newHp }));
        setBattleLog(prev => [...prev, `${wildPokemonState.name || 'Wild Pokemon'} used ${randomMove.name}! Dealt ${damage} damage.`]);

        if (newHp === 0) {
          setBattleState('finished');
          onBattleEnd({ 
            winner: 'opponent', 
            loser: 'user',
            battleDuration: Date.now() - battleStartTime,
            movesUsed: battleLog.map(log => ({
              pokemon: wildPokemonState.name,
              move: randomMove.name,
              damage: damage
            })),
            statusEffects: [] // Add any status effects if implemented
          });
        } else {
          setCurrentTurn('user');
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, battleState, wildPokemonState, userPokemonState.currentHp, onBattleEnd, battleStartTime, battleLog]);

  // Update the move button display to show the calculated damage
  const getMoveDamagePreview = (move) => {
    if (!wildPokemonState) return '??';
    return calculateMoveDamage(userPokemonState, wildPokemonState, move);
  };

  if (isLoading) return <div className="text-center p-4">Loading battle...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!wildPokemonState) return <div className="text-center p-4">Preparing battle...</div>;

  // Get Pokemon image URLs with fallbacks
  const userPokemonImage = userPokemon?.sprites?.back_default || 
    (userPokemon?.id ? 
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${userPokemon.id}.png` :
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png');
  
  const wildPokemonImage = wildPokemon?.sprites?.front_default || 
    (wildPokemon?.id ?
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${wildPokemon.id}.png` :
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png');

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* User Pokemon Side */}
        <div className="text-center">
          <div className="mb-4">
            <img 
              src={userPokemonImage} 
              alt={userPokemonState.name || 'Your Pokemon'} 
              className="w-48 h-48 mx-auto pixelated"
              onError={(e) => {
                console.warn('Failed to load user Pokemon image, falling back to default');
                e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png';
              }}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">
              {userPokemonState.name}
              <span className="ml-2 text-sm font-normal text-gray-600">Lv. {userPokemonState.level}</span>
            </h3>
            <div className="mb-2">
              HP: {userPokemonState.currentHp}/{userPokemonState.baseStats.hp}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(userPokemonState.currentHp / userPokemonState.baseStats.hp) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Move Buttons Section */}
          {currentTurn === 'user' && battleState === 'active' && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {userPokemonState.moves.map((move, index) => (
                  <button
                    key={index}
                    onClick={() => handleAttack(move)}
                    className="relative px-4 py-3 bg-blue-600 text-white rounded-lg 
                             transform hover:-translate-y-0.5 
                             transition-all duration-200 shadow-md hover:shadow-lg hover:bg-blue-700
                             disabled:opacity-50 disabled:cursor-not-allowed
                             font-medium text-center"
                    disabled={currentTurn !== 'user' || battleState !== 'active'}
                  >
                    <div className="font-bold text-lg mb-1 capitalize">{move.name}</div>
                    <div className="text-xs text-white/90">
                      Power: {getMoveDamagePreview(move)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wild Pokemon Side */}
        <div className="text-center">
          <div className="mb-4">
            <img 
              src={wildPokemonImage} 
              alt={wildPokemonState.name || 'Wild Pokemon'} 
              className="w-48 h-48 mx-auto pixelated"
              onError={(e) => {
                console.warn('Failed to load wild Pokemon image, falling back to default');
                e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png';
              }}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">
              {wildPokemonState.name}
              <span className="ml-2 text-sm font-normal text-gray-600">Lv. {wildPokemonState.level}</span>
            </h3>
            <div className="mb-2">
              HP: {wildPokemonState.currentHp}/{wildPokemonState.baseStats.hp}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(wildPokemonState.currentHp / wildPokemonState.baseStats.hp) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Battle Log */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-48 overflow-y-auto text-left">
            <h4 className="font-semibold mb-2">Battle Log:</h4>
            {battleLog.map((log, index) => (
              <p key={index} className="mb-1 text-sm">{log}</p>
            ))}
          </div>
        </div>
      </div>

      {battleState === 'finished' && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">
            {userPokemonState.currentHp === 0 ? 'You Lost!' : 'You Won!'}
          </h2>
        </div>
      )}
    </div>
  );
};

export default BattleArena; 
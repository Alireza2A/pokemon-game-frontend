import { useState } from "react";
import PokemonStats from "./PokemonStats";
import BattleControls from "./BattleControls";

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

function BattleArena({ playerPokemon, wildPokemon, onBattleEnd }) {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleLog, setBattleLog] = useState([]);
  const [battleStatus, setBattleStatus] = useState("active");
  const [statusEffects, setStatusEffects] = useState({
    player: [],
    wild: []
  });
  const [movesUsed, setMovesUsed] = useState([]);
  const [battleStartTime] = useState(Date.now());

  function calculateDamage(attacker, defender, move) {
    // Base damage calculation
    let damage = (attacker.level * 2 + 10) / 250 * (move.power * attacker.attack) / defender.defense + 2;

    // Apply type effectiveness
    const effectiveness = TYPE_EFFECTIVENESS[move.type]?.[defender.type] || 1;
    damage *= effectiveness;

    // Apply status effects
    const attackerStatus = statusEffects[isPlayerTurn ? "player" : "wild"];
    attackerStatus.forEach(status => {
      if (STATUS_EFFECTS[status].attack) {
        damage *= STATUS_EFFECTS[status].attack;
      }
    });

    // Apply STAB (Same Type Attack Bonus)
    if (move.type === attacker.type) {
      damage *= 1.5;
    }

    // Random factor (85-100%)
    damage *= (Math.random() * 0.15 + 0.85);

    return Math.floor(damage);
  }

  function applyStatusEffect(target, effect) {
    const targetKey = target === playerPokemon ? "player" : "wild";
    setStatusEffects(prev => ({
      ...prev,
      [targetKey]: [...prev[targetKey], effect]
    }));
  }

  function processStatusEffects(pokemon, isPlayer) {
    const effects = statusEffects[isPlayer ? "player" : "wild"];
    let damage = 0;
    let canMove = true;

    effects.forEach(effect => {
      const status = STATUS_EFFECTS[effect];
      if (status.damagePerTurn) {
        damage += Math.floor(pokemon.maxHp * status.damagePerTurn);
      }
      if (status.canMove !== undefined) {
        canMove = canMove && Math.random() > status.canMove;
      }
    });

    return { damage, canMove };
  }

  function recordMove(move, attacker, defender) {
    setMovesUsed(prev => [...prev, {
      moveName: move.name,
      moveType: move.type,
      attacker: attacker.name,
      defender: defender.name,
      timestamp: Date.now()
    }]);
  }

  async function handleMoveSelect(move) {
    if (!isPlayerTurn || battleStatus !== "active") return;

    // Process player's turn
    const playerStatus = processStatusEffects(playerPokemon, true);
    if (!playerStatus.canMove) {
      addToBattleLog(`${playerPokemon.name} is unable to move!`);
      setIsPlayerTurn(false);
      handleWildTurn();
      return;
    }

    const damage = calculateDamage(playerPokemon, wildPokemon, move);
    wildPokemon.currentHp -= damage;
    addToBattleLog(`${playerPokemon.name} used ${move.name} for ${damage} damage!`);
    recordMove(move, playerPokemon, wildPokemon);

    // Apply status effects if move has them
    if (move.statusEffect) {
      applyStatusEffect(wildPokemon, move.statusEffect);
      addToBattleLog(`${wildPokemon.name} was ${STATUS_EFFECTS[move.statusEffect].name}!`);
    }

    // Check for victory
    if (wildPokemon.currentHp <= 0) {
      wildPokemon.currentHp = 0;
      addToBattleLog(`${wildPokemon.name} fainted!`);
      setBattleStatus("won");
      onBattleEnd("won", {
        movesUsed,
        battleDuration: Date.now() - battleStartTime,
        statusEffects
      });
      return;
    }

    setIsPlayerTurn(false);
    handleWildTurn();
  }

  function handleWildTurn() {
    if (battleStatus !== "active") return;

    // Process wild Pokemon's status effects
    const wildStatus = processStatusEffects(wildPokemon, false);
    if (!wildStatus.canMove) {
      addToBattleLog(`${wildPokemon.name} is unable to move!`);
      setIsPlayerTurn(true);
      return;
    }

    // Wild Pokemon's turn logic
    const move = wildPokemon.moves[Math.floor(Math.random() * wildPokemon.moves.length)];
    const damage = calculateDamage(wildPokemon, playerPokemon, move);
    playerPokemon.currentHp -= damage;
    addToBattleLog(`${wildPokemon.name} used ${move.name} for ${damage} damage!`);
    recordMove(move, wildPokemon, playerPokemon);

    // Apply status effects if move has them
    if (move.statusEffect) {
      applyStatusEffect(playerPokemon, move.statusEffect);
      addToBattleLog(`${playerPokemon.name} was ${STATUS_EFFECTS[move.statusEffect].name}!`);
    }

    // Check for defeat
    if (playerPokemon.currentHp <= 0) {
      playerPokemon.currentHp = 0;
      addToBattleLog(`${playerPokemon.name} fainted!`);
      setBattleStatus("lost");
      onBattleEnd("lost", {
        movesUsed,
        battleDuration: Date.now() - battleStartTime,
        statusEffects
      });
      return;
    }

    setIsPlayerTurn(true);
  }

  function addToBattleLog(message) {
    setBattleLog(prev => [...prev, { message, timestamp: new Date() }]);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <PokemonStats pokemon={playerPokemon} isPlayer={true} statusEffects={statusEffects.player} />
        <PokemonStats pokemon={wildPokemon} isPlayer={false} statusEffects={statusEffects.wild} />
      </div>

      <div className="flex justify-center">
        <BattleControls
          moves={playerPokemon.moves}
          onMoveSelect={handleMoveSelect}
          isPlayerTurn={isPlayerTurn}
          battleStatus={battleStatus}
        />
      </div>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-2">Battle Log</h3>
        {battleLog.map((log, index) => (
          <div key={index} className="text-sm text-gray-300">
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BattleArena; 
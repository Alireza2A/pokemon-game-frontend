'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PokemonStats from './PokemonStats';
import BattleControls from './BattleControls';
import BattleLog from './BattleLog';

export default function BattleArena({
  playerPokemon,
  wildPokemon,
  onAttack,
  isPlayerTurn,
  isBattleOver,
  battleLog,
  result
}) {
  const [showAttackAnimation, setShowAttackAnimation] = useState(false);
  const [attackTarget, setAttackTarget] = useState(null);

  // Handle attack animation
  const handleAttack = async (moveId) => {
    if (isPlayerTurn) {
      setAttackTarget('wild');
      setShowAttackAnimation(true);
      setTimeout(() => {
        setShowAttackAnimation(false);
        onAttack(moveId);
      }, 1000);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
      {/* Battle Scene */}
      <div className="relative h-[400px] bg-gradient-to-b from-sky-400 to-sky-200 rounded-lg shadow-lg overflow-hidden">
        {/* Wild Pokemon */}
        <div className={`absolute top-4 right-4 w-1/3 transition-transform duration-300 ${
          showAttackAnimation && attackTarget === 'wild' ? 'translate-x-4 scale-95' : ''
        }`}>
          <PokemonStats
            pokemon={wildPokemon}
            isWild={true}
          />
        </div>

        {/* Player Pokemon */}
        <div className={`absolute bottom-4 left-4 w-1/3 transition-transform duration-300 ${
          showAttackAnimation && attackTarget === 'player' ? '-translate-x-4 scale-95' : ''
        }`}>
          <PokemonStats
            pokemon={playerPokemon}
            isWild={false}
          />
        </div>

        {/* Battle Status */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {isBattleOver ? (
            <div className="text-center bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">
                {result === 'win' ? 'Victory!' : 'Defeat!'}
              </h2>
              <p className="text-gray-700">
                {result === 'win' 
                  ? `${playerPokemon.name} won the battle!`
                  : `${playerPokemon.name} was defeated!`}
              </p>
            </div>
          ) : (
            <div className="text-center bg-white bg-opacity-80 p-2 rounded-lg">
              <p className="text-lg font-semibold">
                {isPlayerTurn ? "Your turn!" : "Wild Pokemon's turn!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Battle Controls and Log */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <BattleControls
          moves={playerPokemon.moves}
          onAttack={handleAttack}
          disabled={!isPlayerTurn || isBattleOver}
        />
        <BattleLog messages={battleLog} />
      </div>
    </div>
  );
}

BattleArena.propTypes = {
  playerPokemon: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    maxHp: PropTypes.number.isRequired,
    currentHp: PropTypes.number.isRequired,
    moves: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      power: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  wildPokemon: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    maxHp: PropTypes.number.isRequired,
    currentHp: PropTypes.number.isRequired
  }).isRequired,
  onAttack: PropTypes.func.isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  isBattleOver: PropTypes.bool.isRequired,
  battleLog: PropTypes.arrayOf(PropTypes.string).isRequired,
  result: PropTypes.oneOf(['win', 'loss', null])
}; 
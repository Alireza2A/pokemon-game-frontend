'use client';

import PropTypes from 'prop-types';

export default function BattleControls({ moves, onAttack, disabled }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold mb-3">Moves</h3>
      <div className="grid grid-cols-2 gap-3">
        {moves.map((move) => (
          <button
            key={move.id}
            onClick={() => onAttack(move.id)}
            disabled={disabled}
            className={`
              p-3 rounded-lg text-white font-semibold
              transition-all duration-200
              ${disabled 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-blue-500 hover:bg-blue-600 active:transform active:scale-95'
              }
            `}
          >
            <div className="text-sm md:text-base capitalize">{move.name}</div>
            <div className="text-xs md:text-sm opacity-80">Power: {move.power}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

BattleControls.propTypes = {
  moves: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    power: PropTypes.number.isRequired
  })).isRequired,
  onAttack: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}; 
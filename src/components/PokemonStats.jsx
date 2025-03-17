'use client';

import PropTypes from 'prop-types';

export default function PokemonStats({ pokemon, isWild }) {
  const healthPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;
  const healthColor = healthPercentage > 50 ? 'bg-green-500' : 
                     healthPercentage > 20 ? 'bg-yellow-500' : 
                     'bg-red-500';

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${isWild ? 'text-left' : 'text-right'}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold capitalize">
          {isWild ? `Wild ${pokemon.name}` : pokemon.name}
        </h3>
        <span className="text-sm text-gray-600">
          Lv. {pokemon.level}
        </span>
      </div>

      {/* HP Bar */}
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${healthColor} transition-all duration-500 ease-out`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>

      {/* HP Numbers */}
      <div className="mt-1 text-sm text-gray-600">
        {pokemon.currentHp} / {pokemon.maxHp} HP
      </div>
    </div>
  );
}

PokemonStats.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    maxHp: PropTypes.number.isRequired,
    currentHp: PropTypes.number.isRequired
  }).isRequired,
  isWild: PropTypes.bool.isRequired
}; 
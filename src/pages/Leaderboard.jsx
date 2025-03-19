import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/userService';

// Mock data for testing when API isn't available
const MOCK_LEADERBOARD_DATA = [
  {
    id: 1,
    username: 'Ash',
    characterIcon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ash.png',
    team: [
      {
        name: 'Pikachu',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }
      },
      {
        name: 'Charizard',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' }
      }
    ],
    score: 156,
    wins: 15,
    losses: 3
  },
  {
    id: 2,
    username: 'Misty',
    characterIcon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/misty.png',
    team: [
      {
        name: 'Starmie',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png' }
      },
      {
        name: 'Psyduck',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png' }
      }
    ],
    score: 142,
    wins: 12,
    losses: 5
  },
  {
    id: 3,
    username: 'Brock',
    characterIcon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brock.png',
    team: [
      {
        name: 'Onix',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png' }
      },
      {
        name: 'Geodude',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png' }
      }
    ],
    score: 120,
    wins: 10,
    losses: 8
  },
  {
    id: 4,
    username: 'GaryOak',
    characterIcon: null,
    team: [
      {
        name: 'Blastoise',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png' }
      }
    ],
    score: 98,
    wins: 8, 
    losses: 10
  },
  {
    id: 5,
    username: 'Player5',
    characterIcon: null,
    team: [],
    score: 45,
    wins: 4,
    losses: 10
  }
];

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        let data;
        
        try {
          // Try to get data from API first
          data = await getLeaderboard();
        } catch (apiError) {
          console.warn('API error, using mock data:', apiError);
          // Fall back to mock data if API fails
          data = MOCK_LEADERBOARD_DATA;
        }
        
        setLeaderboardData(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper function to render Pokemon team preview
  const renderTeamPreview = (team) => {
    if (!team || team.length === 0) return <span className="text-gray-400">No team</span>;
    
    return (
      <div className="flex space-x-1">
        {team.slice(0, 3).map((pokemon, idx) => (
          <div key={idx} className="relative group">
            <img
              src={pokemon.sprites?.front_default || '/placeholder-pokemon.png'}
              alt={pokemon.name}
              className="w-8 h-8"
              title={pokemon.name}
            />
            <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 
                           bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {pokemon.name}
            </span>
          </div>
        ))}
        {team.length > 3 && (
          <span className="text-sm text-gray-500 flex items-center">+{team.length - 3}</span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Trainer Rankings</h1>
        <div className="text-sm text-gray-600">
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Trainer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Team</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">W/L Ratio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((user, index) => (
              <tr key={user.id || index} 
                  className={`${index === 0 ? 'bg-yellow-50' : 
                              index === 1 ? 'bg-gray-50' : 
                              index === 2 ? 'bg-orange-50' : ''} 
                              hover:bg-blue-50 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.characterIcon && (
                      <img
                        src={user.characterIcon}
                        alt="Trainer"
                        className="w-8 h-8 rounded-full mr-3"
                        onError={(e) => {
                          e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/pokemonbreeder-gen3.png';
                        }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username || 'Unknown Trainer'}</div>
                      <div className="text-xs text-gray-500">Trainer ID: {user.id || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderTeamPreview(user.team)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.score || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.wins || 0}/{user.losses || 0}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 
import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/userService';
import { useRoster } from '../context/RosterContext';

// Import available trainer icons
import ashIcon from "../assets/icons/Ash-Icon.svg";
import mistyIcon from "../assets/icons/Misty-Icon.svg";
import brockIcon from "../assets/icons/Brock-Icon.svg";
import jamesIcon from "../assets/icons/James-Icon.svg";
import jessieIcon from "../assets/icons/Jessie-Icon.svg";

// Mock data for testing when API isn't available
const MOCK_LEADERBOARD_DATA = [
  {
    id: 1,
    username: 'Ash',
    characterIcon: ashIcon,
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
    characterIcon: mistyIcon,
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
    characterIcon: brockIcon,
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
    username: 'Gary',
    characterIcon: jamesIcon,
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
    username: 'Erika',
    characterIcon: jessieIcon,
    team: [
      {
        name: 'Vileplume',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png' }
      }
    ],
    score: 85,
    wins: 7,
    losses: 8
  },
  {
    id: 6,
    username: 'Lance',
    characterIcon: ashIcon,
    team: [
      {
        name: 'Dragonite',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' }
      }
    ],
    score: 74,
    wins: 5,
    losses: 10
  },
  {
    id: 7,
    username: 'Sabrina',
    characterIcon: mistyIcon,
    team: [
      {
        name: 'Alakazam',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png' }
      }
    ],
    score: 45,
    wins: 4,
    losses: 10
  }
];

// Utility function to map username to trainer icon
const getTrainerIconByUsername = (username) => {
  if (!username) return null;
  
  const iconMap = {
    'Ash': ashIcon,
    'Misty': mistyIcon,
    'Brock': brockIcon,
    'James': jamesIcon,
    'Jessie': jessieIcon,
    // Other usernames will use the fallback (initial letter)
  };
  
  return iconMap[username] || null;
};

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [lastBattleResult, setLastBattleResult] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { roster } = useRoster();

  useEffect(() => {
    // Check if we have a last battle result in session storage
    const storedBattleResult = sessionStorage.getItem('lastBattleResult');
    if (storedBattleResult) {
      setLastBattleResult(JSON.parse(storedBattleResult));
      // Remove it after retrieving to prevent showing on refresh
      sessionStorage.removeItem('lastBattleResult');
    }

    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        let leaderboardData;
        
        try {
          // Try to get real data from API first
          leaderboardData = await getLeaderboard();
          
          // Transform API data if needed
          if (leaderboardData && Array.isArray(leaderboardData)) {
            // Add trainer icons to entries based on usernames
            leaderboardData = leaderboardData.map(entry => ({
              ...entry,
              characterIcon: getTrainerIconByUsername(entry.username)
            }));
            
            // Sort by score in descending order if not already sorted
            leaderboardData = leaderboardData.sort((a, b) => b.score - a.score);
            
            // Make sure winLossRatio is calculated properly
            leaderboardData = leaderboardData.map(entry => ({
              ...entry,
              ratio: entry.wins && entry.losses 
                ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
                : 0
            }));
          }
        } catch (apiError) {
          console.warn('API error, using mock data:', apiError);
          // Fall back to mock data if API fails
          leaderboardData = MOCK_LEADERBOARD_DATA.map(entry => ({
            ...entry,
            ratio: entry.wins && entry.losses 
              ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
              : 0
          }));
        }
        
        // If we have real user data, add it to first position
        const userId = parseInt(localStorage.getItem('userId') || '1');
        const currentUserIndex = leaderboardData.findIndex(user => user.id === userId);
        
        if (currentUserIndex !== -1) {
          const currentUser = {
            ...leaderboardData[currentUserIndex],
            // Make sure the icon is set
            characterIcon: getTrainerIconByUsername(leaderboardData[currentUserIndex].username)
          };
          setCurrentUser(currentUser);
        } else {
          // Create default user if not found
          const defaultUser = {
            id: userId,
            username: 'Ash', // Default name
            characterIcon: getTrainerIconByUsername('Ash'),
            team: [],
            wins: parseInt(localStorage.getItem('userWins') || '0'),
            losses: parseInt(localStorage.getItem('userLosses') || '0'),
            ratio: 0
          };
          
          // Calculate ratio
          if (defaultUser.wins + defaultUser.losses > 0) {
            defaultUser.ratio = Math.round((defaultUser.wins / (defaultUser.wins + defaultUser.losses)) * 100);
          }
          
          setCurrentUser(defaultUser);
        }
        
        setLeaderboardData(leaderboardData);
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
    if (!team || team.length === 0) {
      return <span className="text-gray-400">No Pokémon</span>;
    }
    
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

  const renderTrainerAvatar = (user) => {
    const initial = user.username ? user.username.charAt(0).toUpperCase() : 'T';
    
    return (
      <div className="relative flex-shrink-0 flex items-center justify-center mr-3">
        {/* Background circle with initial - always visible as fallback */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          }}
        >
          {initial}
        </div>
        
        {/* Overlay actual trainer icon on top if available */}
        {user.characterIcon && (
          <img
            src={user.characterIcon}
            alt={`${user.username || 'Trainer'} icon`}
            className="absolute top-0 left-0 w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              // Hide the image element if it fails to load
              e.target.style.display = 'none';
            }}
          />
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
    <div className="max-w-6xl mx-auto p-4">
      {lastBattleResult && (
        <div className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-blue-800">Recent Battle Result</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
            <div className="flex items-center">
              <span className={`font-bold ${lastBattleResult.winner === 'user' ? 'text-green-600' : 'text-red-600'}`}>
                {lastBattleResult.winner === 'user' ? 'Victory!' : 'Defeat'}
              </span>
              <span className="mx-2">•</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>Your {lastBattleResult.pokemonName}</span>
              <span className="mx-1">vs</span>
              <span>{lastBattleResult.opponentName}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Trainer Rankings</h1>
        <div className="text-sm text-gray-600">
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h2 className="text-xl font-bold text-white">Trainer Rankings</h2>
          <p className="text-indigo-100 text-sm">Compete to climb the ranks!</p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading leaderboard data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData.map((user, index) => (
                  <tr key={user.id} className={user.id === currentUser?.id ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderTrainerAvatar(user)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username || 'Unknown Trainer'}</div>
                          <div className="text-xs text-green-600 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block mr-1"></span>
                            Active trainer
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderTeamPreview(user.team)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">{user.ratio}%</span>
                        <span className="text-gray-500 text-xs ml-1">({user.wins || 0}W - {user.losses || 0}L)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${user.ratio}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 
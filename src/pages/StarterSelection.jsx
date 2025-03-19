import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useRoster } from "../context/RosterContext";
import { addPokemonPersistant } from "../data/userPokemons";

const StarterSelection = () => {
  const navigate = useNavigate();
  const { addPokemon } = useRoster();

  const [starters, setStarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [animatingSelect, setAnimatingSelect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Starter Pokémon IDs
  const starterIds = [4, 1, 7]; // Charmander, Bulbasaur, Squirtle

  useEffect(() => {
    const fetchStarters = async () => {
      try {
        setLoading(true);

        // Fetch all three starter Pokémon data in parallel
        const starterData = await Promise.all(
          starterIds.map(async (id) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch Pokémon #${id}`);
            }
            return response.json();
          })
        );

        setStarters(starterData);
      } catch (err) {
        console.error("Error fetching starter Pokémon:", err);
        setError(err.message || "Failed to load starter Pokémon");
      } finally {
        setLoading(false);
      }
    };

    fetchStarters();
  }, []);

  // Function to select a starter
  const selectStarter = async (pokemon) => {
    setSelectedPokemon(pokemon);
    setAnimatingSelect(true);

    // Simulate catching animation
    setTimeout(async () => {
      try {
        await addPokemonPersistant(pokemon);

        // Add to caught Pokémon in context
        addPokemon(pokemon);

        // Show success message
        setAnimatingSelect(false);
        setShowSuccess(true);

        // Redirect after a delay
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        console.error("Error selecting starter:", err);
        setError(err.message || "Failed to select starter Pokémon");
        setAnimatingSelect(false);
      }
    }, 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-500 to-indigo-600">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-white border-solid"></div>
          <p className="mt-4 text-xl">Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-500 to-red-600">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Your Pokémon Journey!
          </h1>
          <p className="text-xl md:text-2xl">
            Choose your first Pokémon companion to begin your adventure.
          </p>
        </div>

        {/* Professor Introduction */}
        <div className="bg-white/90 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center shadow-xl">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
            <svg
              className="w-20 h-20 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Professor Oak
            </h2>
            <p className="text-gray-600">
              "Welcome to the world of Pokémon! I'm Professor Oak, and I'm here
              to guide you on your journey. Before you set off, you'll need to
              choose your first Pokémon partner. This choice is important, as
              your starter will be your loyal companion through many adventures
              ahead. Choose wisely!"
            </p>
          </div>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl p-8 max-w-md text-center shadow-2xl animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Great Choice!
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedPokemon?.name.charAt(0).toUpperCase() +
                  selectedPokemon?.name.slice(1)}{" "}
                is now your partner! Your adventure begins now.
              </p>
              <div className="w-12 h-12 mx-auto animate-bounce">
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="white"
                    stroke="#E53E3E"
                    strokeWidth="2"
                  />
                  <path d="M2 12h20" stroke="#E53E3E" strokeWidth="2" />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="white"
                    stroke="#E53E3E"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Starter selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {starters.map((pokemon) => {
            // Define type-based colors
            const typeColorMap = {
              fire: "from-red-400 to-orange-500",
              grass: "from-green-400 to-emerald-500",
              water: "from-blue-400 to-cyan-500",
            };

            // Get the primary type
            const primaryType = pokemon.types[0].type.name;
            const gradientColors =
              typeColorMap[primaryType] || "from-gray-400 to-gray-500";

            return (
              <div
                key={pokemon.id}
                className={`relative ${
                  selectedPokemon && selectedPokemon.id !== pokemon.id
                    ? "opacity-50"
                    : ""
                }`}
              >
                <div
                  className={`relative bg-gradient-to-b ${gradientColors} rounded-xl p-6 shadow-lg overflow-hidden
                    ${
                      !selectedPokemon || selectedPokemon.id === pokemon.id
                        ? "hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                        : ""
                    }
                  `}
                  onClick={() => !selectedPokemon && selectStarter(pokemon)}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg
                      width="100%"
                      height="100%"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <pattern
                        id="pattern-circles"
                        width="50"
                        height="50"
                        patternUnits="userSpaceOnUse"
                        patternContentUnits="userSpaceOnUse"
                      >
                        <circle cx="25" cy="25" r="10" fill="white" />
                      </pattern>
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#pattern-circles)"
                      />
                    </svg>
                  </div>

                  {/* Pokémon image */}
                  <div className="relative mb-4">
                    <div className="w-48 h-48 mx-auto">
                      <img
                        src={
                          pokemon.sprites.other["official-artwork"]
                            .front_default || pokemon.sprites.front_default
                        }
                        alt={pokemon.name}
                        className={`w-full h-full object-contain drop-shadow-lg
                          ${
                            selectedPokemon &&
                            selectedPokemon.id === pokemon.id &&
                            animatingSelect
                              ? "animate-bounce"
                              : ""
                          }
                        `}
                      />
                    </div>

                    {/* Pokéball animation */}
                    {selectedPokemon &&
                      selectedPokemon.id === pokemon.id &&
                      animatingSelect && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-ping">
                            <svg
                              viewBox="0 0 24 24"
                              width="80"
                              height="80"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="white"
                                stroke="#E53E3E"
                                strokeWidth="2"
                              />
                              <path
                                d="M2 12h20"
                                stroke="#E53E3E"
                                strokeWidth="2"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                fill="white"
                                stroke="#E53E3E"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Pokémon info */}
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2 capitalize">
                      {pokemon.name}
                    </h3>
                    <div className="flex justify-center gap-2 mb-4">
                      {pokemon.types.map((typeInfo) => (
                        <span
                          key={typeInfo.type.name}
                          className="px-3 py-1 bg-white/25 rounded-full text-sm capitalize"
                        >
                          {typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm opacity-75 mb-4">
                      {primaryType === "fire" &&
                        "Perfect for trainers who want a powerful offensive Pokémon."}
                      {primaryType === "grass" &&
                        "Great balance of offense and defense with useful status moves."}
                      {primaryType === "water" &&
                        "Solid defense and versatile movepool for many situations."}
                    </p>
                    <button
                      className={`w-full py-3 px-6 bg-white font-bold rounded-lg 
                        ${
                          primaryType === "fire"
                            ? "text-red-500"
                            : primaryType === "grass"
                            ? "text-green-500"
                            : "text-blue-500"
                        } 
                        shadow-md hover:shadow-lg transition-all
                        ${
                          selectedPokemon
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:-translate-y-1"
                        }
                      `}
                      disabled={!!selectedPokemon}
                      onClick={() => !selectedPokemon && selectStarter(pokemon)}
                    >
                      {selectedPokemon && selectedPokemon.id === pokemon.id
                        ? animatingSelect
                          ? "Catching..."
                          : "Selected!"
                        : "I Choose You!"}
                    </button>
                  </div>
                </div>

                {/* Pokéball base */}
                <div className="h-6 bg-gradient-to-b from-red-600 to-red-700 rounded-b-full mx-auto -mt-3 w-24 shadow-lg"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StarterSelection;

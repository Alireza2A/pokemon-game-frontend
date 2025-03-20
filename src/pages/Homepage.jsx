import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import { useCaughtPokemon } from "../context/CaughtPokemonContext";

const Homepage = () => {
  const caughtPokemonContext = useCaughtPokemon();

  // Safely destructure the context only if it exists
  const {
    isPokemonCaught = () => false,
    caughtPokemon = [],
    isInitialized = false,
  } = caughtPokemonContext || {};

  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [caughtFilter, setCaughtFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonTypes, setPokemonTypes] = useState(["all"]);

  const pokemonPerPage = 12;

  // Fetch pokemon on initial load
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        // Get the total count first
        const countResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1"
        );
        const countData = await countResponse.json();
        const totalCount = Math.min(151, countData.count); // Limit to first 151 Pokémon

        // Fetch details for the first 151 Pokémon
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${totalCount}`
        );
        const data = await response.json();

        // Fetch detailed info for each Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemon(pokemonDetails);

        // Extract all unique types
        const types = new Set();
        types.add("all");
        pokemonDetails.forEach((p) => {
          p.types.forEach((typeInfo) => {
            types.add(typeInfo.type.name);
          });
        });
        setPokemonTypes(Array.from(types).sort());
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
        setError("Failed to load Pokémon. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filter and search pokemon
  const filteredPokemon = pokemon.filter((p) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm);

    // Filter by type
    const matchesType =
      typeFilter === "all" || p.types.some((t) => t.type.name === typeFilter);

    // Filter by caught status (only if context is initialized)
    const matchesCaught =
      !isInitialized || // Skip this filter if context isn't ready
      caughtFilter === "all" ||
      (caughtFilter === "caught" && isPokemonCaught(p.id)) ||
      (caughtFilter === "uncaught" && !isPokemonCaught(p.id));

    return matchesSearch && matchesType && matchesCaught;
  });

  // Pagination
  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle type filter
  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle caught filter
  const handleCaughtFilter = (e) => {
    setCaughtFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-xl">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h2 className="font-bold text-xl mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 rounded-xl mb-8 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Pokémon Battle</h1>
          <p className="text-xl mb-6">
            Browse the collection, build your roster, and battle to climb the
            leaderboard!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/roster"
              className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              View My Roster
            </Link>
            <Link
              to="/battle"
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-md hover:bg-yellow-300 transition-colors"
            >
              Battle Now
            </Link>
          </div>
        </div>
      </div>

      {/* Caught Pokemon stats - Only shown if context is initialized */}
      {isInitialized && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Your Collection</h2>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {caughtPokemon.length} / {pokemon.length} Pokémon Caught
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-yellow-400 h-2.5 rounded-full"
              style={{
                width: `${(caughtPokemon.length / pokemon.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Pokémon
            </label>
            <input
              type="text"
              id="search"
              placeholder="Enter name or ID..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Type filter */}
          <div className="md:w-1/4">
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Type
            </label>
            <select
              id="type-filter"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={typeFilter}
              onChange={handleTypeFilter}
            >
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Caught filter - Only shown if context is initialized */}
          {isInitialized && (
            <div className="md:w-1/4">
              <label
                htmlFor="caught-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Collection Status
              </label>
              <select
                id="caught-filter"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={caughtFilter}
                onChange={handleCaughtFilter}
              >
                <option value="all">All Pokémon</option>
                <option value="caught">Caught Only</option>
                <option value="uncaught">Not Caught</option>
              </select>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPokemon.length} of {pokemon.length} Pokémon
          {searchTerm && <span> matching "{searchTerm}"</span>}
          {typeFilter !== "all" && <span> of type "{typeFilter}"</span>}
          {isInitialized && caughtFilter !== "all" && (
            <span>
              {" "}
              that are {caughtFilter === "caught" ? "caught" : "not caught"}
            </span>
          )}
        </div>
      </div>

      {/* Pokemon grid */}
      {currentPokemon.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Pokémon Found
          </h2>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
              setCaughtFilter("all");
            }}
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPokemon.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                // Only pass context props if initialized
                contextReady={isInitialized}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show limited page numbers
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === pageNumber
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 &&
                      currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Homepage;

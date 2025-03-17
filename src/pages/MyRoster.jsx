import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useRoster } from "../context/RosterContext";
import PokemonCard from "../components/PokemonCard";
import EmptyRoster from "../components/EmptyRoster";

const MyRoster = () => {
  const { roster } = useRoster();
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Extract all unique types from roster pokemon
  const pokemonTypes = useMemo(() => {
    const types = new Set();
    roster.forEach((pokemon) => {
      pokemon.types.forEach((type) => {
        types.add(type.type.name);
      });
    });
    return ["all", ...Array.from(types)];
  }, [roster]);

  // Filter and sort pokemon
  const filteredRoster = useMemo(() => {
    // First filter by type
    let result =
      filterType === "all"
        ? roster
        : roster.filter((pokemon) =>
            pokemon.types.some((type) => type.type.name === filterType)
          );

    // Then sort
    return [...result].sort((a, b) => {
      let comparison;

      if (sortBy === "id") {
        comparison = a.id - b.id;
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "hp") {
        const aHP =
          a.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0;
        const bHP =
          b.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0;
        comparison = aHP - bHP;
      } else if (sortBy === "attack") {
        const aAtk =
          a.stats.find((stat) => stat.stat.name === "attack")?.base_stat || 0;
        const bAtk =
          b.stats.find((stat) => stat.stat.name === "attack")?.base_stat || 0;
        comparison = aAtk - bAtk;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [roster, filterType, sortBy, sortDirection]);

  // Toggle sort direction
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  if (roster.length === 0) {
    return <EmptyRoster />;
  }

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Pokémon Roster
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your team of {roster.length} Pokémon
          </p>
        </div>

        {roster.length >= 3 && (
          <Link
            to="/battle"
            className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
              />
            </svg>
            Battle Now
          </Link>
        )}
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="type-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Type:
          </label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

        <div className="flex-1">
          <label
            htmlFor="sort-by"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By:
          </label>
          <div className="flex gap-2">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="id">ID Number</option>
              <option value="name">Name</option>
              <option value="hp">HP</option>
              <option value="attack">Attack</option>
            </select>

            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Toggle sort direction"
            >
              {sortDirection === "asc" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pokemon Roster Grid */}
      {filteredRoster.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">
            No Pokémon match your filter criteria.
          </p>
          <button
            onClick={() => setFilterType("all")}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRoster.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoster;

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import RosterButton from "../components/RosterButton";
import { useRoster } from "../context/RosterContext";

const typeColors = {
  normal: {
    light: "bg-gray-100",
    medium: "bg-gray-300",
    dark: "bg-gray-500",
    text: "text-gray-800",
  },
  fire: {
    light: "bg-red-100",
    medium: "bg-red-400",
    dark: "bg-red-600",
    text: "text-white",
  },
  water: {
    light: "bg-blue-100",
    medium: "bg-blue-400",
    dark: "bg-blue-600",
    text: "text-white",
  },
  electric: {
    light: "bg-yellow-100",
    medium: "bg-yellow-300",
    dark: "bg-yellow-500",
    text: "text-gray-800",
  },
  grass: {
    light: "bg-green-100",
    medium: "bg-green-400",
    dark: "bg-green-600",
    text: "text-white",
  },
  ice: {
    light: "bg-blue-50",
    medium: "bg-blue-200",
    dark: "bg-blue-400",
    text: "text-gray-800",
  },
  fighting: {
    light: "bg-red-100",
    medium: "bg-red-600",
    dark: "bg-red-800",
    text: "text-white",
  },
  poison: {
    light: "bg-purple-100",
    medium: "bg-purple-400",
    dark: "bg-purple-600",
    text: "text-white",
  },
  ground: {
    light: "bg-yellow-100",
    medium: "bg-yellow-600",
    dark: "bg-yellow-800",
    text: "text-white",
  },
  flying: {
    light: "bg-indigo-50",
    medium: "bg-indigo-300",
    dark: "bg-indigo-500",
    text: "text-white",
  },
  psychic: {
    light: "bg-pink-100",
    medium: "bg-pink-400",
    dark: "bg-pink-600",
    text: "text-white",
  },
  bug: {
    light: "bg-lime-100",
    medium: "bg-lime-500",
    dark: "bg-lime-700",
    text: "text-white",
  },
  rock: {
    light: "bg-stone-100",
    medium: "bg-stone-500",
    dark: "bg-stone-700",
    text: "text-white",
  },
  ghost: {
    light: "bg-purple-100",
    medium: "bg-purple-600",
    dark: "bg-purple-800",
    text: "text-white",
  },
  dragon: {
    light: "bg-indigo-100",
    medium: "bg-indigo-600",
    dark: "bg-indigo-800",
    text: "text-white",
  },
  dark: {
    light: "bg-gray-200",
    medium: "bg-gray-700",
    dark: "bg-gray-900",
    text: "text-white",
  },
  steel: {
    light: "bg-gray-200",
    medium: "bg-gray-400",
    dark: "bg-gray-600",
    text: "text-white",
  },
  fairy: {
    light: "bg-pink-50",
    medium: "bg-pink-300",
    dark: "bg-pink-500",
    text: "text-gray-800",
  },
  default: {
    light: "bg-gray-100",
    medium: "bg-gray-400",
    dark: "bg-gray-600",
    text: "text-white",
  },
};

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rosterCount } = useRoster();

  // Fetch pokemon data
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch basic pokemon data
        const pokemonRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        if (!pokemonRes.ok) {
          throw new Error("Pokemon not found");
        }
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        // Fetch species data
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);

        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const evolutionRes = await fetch(speciesData.evolution_chain.url);
          const evolutionData = await evolutionRes.json();
          setEvolutionChain(evolutionData);
        }
      } catch (err) {
        console.error("Error fetching Pokemon:", err);
        setError(err.message || "Failed to load Pokémon data");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [id]);

  // Helper function to get English flavor text
  const getEnglishFlavorText = () => {
    if (!species || !species.flavor_text_entries)
      return "No description available.";

    const englishEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    return englishEntry
      ? englishEntry.flavor_text.replace(/\f/g, " ")
      : "No description available.";
  };

  // Helper function to get English genus
  const getEnglishGenus = () => {
    if (!species || !species.genera) return "";

    const englishGenus = species.genera.find(
      (genus) => genus.language.name === "en"
    );

    return englishGenus ? englishGenus.genus : "";
  };

  // Get the primary type for styling
  const getPrimaryType = () => {
    if (!pokemon || !pokemon.types || pokemon.types.length === 0)
      return "default";
    return pokemon.types[0].type.name;
  };

  // Stat percentage calculation
  const calculateStatPercentage = (value) => {
    const maxValue = 255; // Max possible stat value in Pokemon
    return Math.min(100, (value / maxValue) * 100);
  };

  // Stat color based on value
  const getStatColor = (value) => {
    if (value >= 150) return "bg-green-500";
    if (value >= 90) return "bg-green-400";
    if (value >= 60) return "bg-yellow-400";
    if (value >= 30) return "bg-orange-400";
    return "bg-red-400";
  };

  // Format evolution data for display
  const formatEvolutionChain = () => {
    if (!evolutionChain || !evolutionChain.chain) return [];

    const evoChain = [];
    let currentEvo = evolutionChain.chain;

    // Start with the base form
    evoChain.push({
      name: currentEvo.species.name,
      url: currentEvo.species.url,
      id: getIdFromUrl(currentEvo.species.url),
    });

    // Process the evolution chain recursively
    while (currentEvo.evolves_to && currentEvo.evolves_to.length > 0) {
      currentEvo = currentEvo.evolves_to[0]; // For simplicity, just take the first evolution path
      evoChain.push({
        name: currentEvo.species.name,
        url: currentEvo.species.url,
        id: getIdFromUrl(currentEvo.species.url),
        trigger: currentEvo.evolution_details[0]?.trigger?.name,
        minLevel: currentEvo.evolution_details[0]?.min_level,
        item: currentEvo.evolution_details[0]?.item?.name,
      });
    }

    return evoChain;
  };

  // Extract ID from species URL
  const getIdFromUrl = (url) => {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!pokemon) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Pokémon Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The Pokémon you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  // Get styling based on primary type
  const primaryType = getPrimaryType();
  const typeStyle = typeColors[primaryType] || typeColors.default;

  // Format ID and Name
  const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Get the best sprite image available
  const imageUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.other?.["dream_world"]?.front_default ||
    pokemon.sprites?.front_default;

  // Get evolution chain data
  const evoChain = formatEvolutionChain();

  return (
    <div>
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to all Pokémon
        </Link>
      </div>

      {/* Main Pokémon card */}
      <div
        className={`rounded-2xl overflow-hidden shadow-lg border-t-4 ${typeStyle.medium}`}
      >
        <div className={`${typeStyle.light} px-6 py-8`}>
          <div className="md:flex items-start">
            {/* Pokémon image */}
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div
                className={`rounded-full p-6 ${typeStyle.medium} bg-opacity-30`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="w-64 h-64 object-contain filter drop-shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Pokémon info */}
            <div className="md:w-2/3 text-gray-800 md:pl-8">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div>
                  <div className="text-gray-500 font-medium mb-1">
                    {formattedId}
                  </div>
                  <h1 className="text-4xl font-bold mb-1">{capitalizedName}</h1>
                  <div className="text-gray-700 italic mb-4">
                    {getEnglishGenus()}
                  </div>

                  {/* Types */}
                  <div className="flex gap-2 mb-4">
                    {pokemon.types.map((typeInfo) => {
                      const typeName = typeInfo.type.name;
                      const style = typeColors[typeName] || typeColors.default;

                      return (
                        <span
                          key={typeName}
                          className={`${style.medium} ${style.text} px-4 py-1 rounded-full text-sm font-medium`}
                        >
                          {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Roster button */}
                <div className="mt-4 md:mt-0">
                  <RosterButton
                    pokemon={pokemon}
                    className="w-full md:w-auto"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 p-4 bg-white rounded-lg text-gray-800 shadow-inner">
                <h2 className="text-lg font-semibold mb-2">Pokédex Entry</h2>
                <p className="text-gray-700">{getEnglishFlavorText()}</p>
              </div>

              {/* Basic stats */}
              <div className="grid grid-cols-2 text-gray-800 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white text-gray-800 p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Height</div>
                  <div className="text-lg font-medium">
                    {(pokemon.height / 10).toFixed(1)} m
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Weight</div>
                  <div className="text-lg font-medium">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Base Experience</div>
                  <div className="text-lg font-medium">
                    {pokemon.base_experience || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Abilities Tabs */}
        <div className="bg-white text-gray-800 p-6">
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Base Stats</h2>
            <div className="space-y-4">
              {pokemon.stats.map((statInfo) => {
                const statName = statInfo.stat.name;
                const value = statInfo.base_stat;
                const percentage = calculateStatPercentage(value);

                // Format stat name
                const displayName =
                  {
                    hp: "HP",
                    attack: "Attack",
                    defense: "Defense",
                    "special-attack": "Sp. Attack",
                    "special-defense": "Sp. Defense",
                    speed: "Speed",
                  }[statName] ||
                  statName
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return (
                  <div key={statName}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {displayName}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getStatColor(value)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {/* Total stats */}
              <div className="pt-2 mt-2 border-t border-gray-300">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-700">Total</span>
                  <span className="font-bold text-gray-700">
                    {pokemon.stats.reduce(
                      (total, stat) => total + stat.base_stat,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="mt-6 bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Abilities</h2>
            <div className="space-y-3 text-gray-800">
              {pokemon.abilities.map((abilityInfo) => {
                const abilityName = abilityInfo.ability.name
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");

                return (
                  <div
                    key={abilityInfo.ability.name}
                    className="flex items-center"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${typeStyle.medium} mr-2`}
                    ></div>
                    <span className="font-medium">{abilityName}</span>
                    {abilityInfo.is_hidden && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evolution chain */}
          {evoChain.length > 1 && (
            <div className="mt-6 bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Evolution Chain
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center">
                {evoChain.map((evo, index) => (
                  <React.Fragment key={evo.id}>
                    {/* Pokemon */}
                    <div
                      className={`flex flex-col items-center ${
                        index !== 0 ? "mt-4 sm:mt-0" : ""
                      }`}
                    >
                      <Link
                        to={`/pokemon/${evo.id}`}
                        className={`block p-3 rounded-full ${
                          pokemon.id === parseInt(evo.id)
                            ? typeStyle.medium
                            : "bg-gray-200"
                        } hover:opacity-90 transition-opacity`}
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                          alt={evo.name}
                          className="w-16 h-16"
                        />
                      </Link>
                      <span className="mt-1 font-medium text-center">
                        {evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}
                      </span>
                    </div>

                    {/* Evolution arrow */}
                    {index < evoChain.length - 1 && (
                      <div className="flex flex-col items-center mx-2 my-2 sm:my-0">
                        <svg
                          className="w-6 h-6 text-gray-400 transform rotate-90 sm:rotate-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <div className="text-xs text-center text-gray-500 mt-1">
                          {evoChain[index + 1].minLevel
                            ? `Lvl ${evoChain[index + 1].minLevel}`
                            : ""}
                          {evoChain[index + 1].item
                            ? `Use ${evoChain[index + 1].item.replace(
                                /-/g,
                                " "
                              )}`
                            : ""}
                          {!evoChain[index + 1].minLevel &&
                          !evoChain[index + 1].item
                            ? "Evolution"
                            : ""}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Battle CTA */}
      {rosterCount >= 3 && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-bold text-indigo-800">Ready for battle?</h3>
            <p className="text-indigo-600">
              Your roster has {rosterCount} Pokémon ready to fight!
            </p>
          </div>
          <Link
            to="/battle"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
          >
            Battle Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default PokemonDetails;

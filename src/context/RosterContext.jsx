import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const RosterContext = createContext();

// Context Provider
export const RosterProvider = ({ children }) => {
  const [roster, setRoster] = useState([]);

  // Load roster from LocalStorage on initial render
  useEffect(() => {
    try {
      const savedRoster =
        JSON.parse(localStorage.getItem("pokemonRoster")) || [];
      setRoster(savedRoster);
    } catch (error) {
      console.error("Error loading roster from localStorage:", error);
      setRoster([]);
    }
  }, []);

  // Save roster to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pokemonRoster", JSON.stringify(roster));
  }, [roster]);

  // Add to the roster
  const addPokemon = (pokemon) => {
    if (!roster.find((p) => p.id === pokemon.id)) {
      setRoster([...roster, pokemon]);
    }
  };

  // Remove from the roster
  const removePokemon = (id) => {
    setRoster(roster.filter((p) => p.id !== id));
  };

  // Check if is in the roster
  const isPokemonInRoster = (id) => {
    return roster.some((pokemon) => pokemon.id === id);
  };

  return (
    <RosterContext.Provider
      value={{
        roster,
        addPokemon,
        removePokemon,
        isPokemonInRoster,
        rosterCount: roster.length,
      }}
    >
      {children}
    </RosterContext.Provider>
  );
};

// Hook to use the context
export const useRoster = () => useContext(RosterContext);

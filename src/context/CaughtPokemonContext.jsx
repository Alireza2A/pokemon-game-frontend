import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const CaughtPokemonContext = createContext();

// Context Provider
export const CaughtPokemonProvider = ({ children }) => {
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load caught Pokemon from localStorage on initial render
  useEffect(() => {
    try {
      console.log("Loading caught Pokemon from localStorage");
      const savedCaughtPokemon = localStorage.getItem("caughtPokemon");

      if (savedCaughtPokemon) {
        const parsedPokemon = JSON.parse(savedCaughtPokemon);
        console.log("Parsed caught Pokemon:", parsedPokemon);
        setCaughtPokemon(parsedPokemon);
      } else {
        console.log("No caught Pokemon found in localStorage");
        setCaughtPokemon([]);
      }
    } catch (error) {
      console.error("Error loading caught Pokémon from localStorage:", error);
      setCaughtPokemon([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save caught Pokemon to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      console.log("Saving caught Pokemon to localStorage:", caughtPokemon);
      localStorage.setItem("caughtPokemon", JSON.stringify(caughtPokemon));
    }
  }, [caughtPokemon, isInitialized]);

  // Add a Pokemon to the caught list
  const catchPokemon = (pokemon) => {
    console.log("Catching Pokemon:", pokemon);
    // Check if the Pokemon is already caught
    if (!caughtPokemon.some((p) => p.id === pokemon.id)) {
      setCaughtPokemon((prevCaught) => [...prevCaught, pokemon]);
      return true;
    }
    return false; // Already caught
  };

  // Check if a Pokemon is caught
  const isPokemonCaught = (id) => {
    return caughtPokemon.some((pokemon) => pokemon.id === id);
  };

  // Get a list of all caught Pokemon IDs
  const getCaughtPokemonIds = () => {
    return caughtPokemon.map((pokemon) => pokemon.id);
  };

  // Record that user has selected a starter Pokemon
  const recordStarterSelection = () => {
    console.log("Recording starter selection");
    localStorage.setItem("hasSelectedStarter", "true");
  };

  // Check if the user has already selected a starter Pokemon
  const hasSelectedStarter = () => {
    const value = localStorage.getItem("hasSelectedStarter");
    console.log("Has selected starter:", value);
    return value === "true";
  };

  const contextValue = {
    caughtPokemon,
    catchPokemon,
    isPokemonCaught,
    getCaughtPokemonIds,
    recordStarterSelection,
    hasSelectedStarter,
    isInitialized,
  };

  console.log("CaughtPokemonContext value:", contextValue);

  return (
    <CaughtPokemonContext.Provider value={contextValue}>
      {children}
    </CaughtPokemonContext.Provider>
  );
};

// Hook to use the context
export const useCaughtPokemon = () => useContext(CaughtPokemonContext);

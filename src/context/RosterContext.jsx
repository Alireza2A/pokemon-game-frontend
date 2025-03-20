import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const RosterContext = createContext();

// Context Provider
export const RosterProvider = ({ children }) => {
  const [roster, setRoster] = useState([]);
  const [activePokemon, setActivePokemon] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load roster from LocalStorage on initial render
  useEffect(() => {
    try {
      console.log("Loading roster from localStorage");
      const savedRoster = localStorage.getItem("pokemonRoster");
      const savedActivePokemon = localStorage.getItem("activePokemon");

      if (savedRoster) {
        const parsedRoster = JSON.parse(savedRoster);
        console.log("Parsed roster:", parsedRoster);
        setRoster(parsedRoster);
      } else {
        console.log("No roster found in localStorage");
        setRoster([]);
      }

      if (savedActivePokemon) {
        const parsedActivePokemon = JSON.parse(savedActivePokemon);
        console.log("Parsed active Pokemon:", parsedActivePokemon);
        setActivePokemon(parsedActivePokemon);
      }
    } catch (error) {
      console.error("Error loading roster from localStorage:", error);
      setRoster([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save roster to LocalStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      console.log("Saving roster to localStorage:", roster);
      localStorage.setItem("pokemonRoster", JSON.stringify(roster));
    }
  }, [roster, isInitialized]);

  // Save active Pokemon to LocalStorage whenever it changes
  useEffect(() => {
    if (isInitialized && activePokemon) {
      console.log("Saving active Pokemon to localStorage:", activePokemon);
      localStorage.setItem("activePokemon", JSON.stringify(activePokemon));
    }
  }, [activePokemon, isInitialized]);

  // Add to the roster
  const addPokemon = (pokemon) => {
    console.log("Adding Pokemon to roster:", pokemon);
    if (!roster.find((p) => p.id === pokemon.id)) {
      setRoster((prevRoster) => [...prevRoster, pokemon]);
    }
  };

  // Remove from the roster
  const removePokemon = (id) => {
    console.log("Removing Pokemon from roster:", id);
    setRoster((prevRoster) => prevRoster.filter((p) => p.id !== id));
    // If active Pokemon is removed, set active to null
    if (activePokemon && activePokemon.id === id) {
      setActivePokemon(null);
      localStorage.removeItem("activePokemon");
    }
  };

  // Set active Pokemon for battle
  const setActivePokemonForBattle = (pokemon) => {
    console.log("Setting active Pokemon for battle:", pokemon);
    setActivePokemon(pokemon);
  };

  // Check if is in the roster
  const isPokemonInRoster = (id) => {
    return roster.some((pokemon) => pokemon.id === id);
  };

  // Update the roster (after battle, etc.)
  const updateRoster = async () => {
    try {
      // Here you would typically fetch the updated roster from an API
      // For now, just use the existing roster from localStorage
      const savedRoster = localStorage.getItem("pokemonRoster");
      if (savedRoster) {
        const parsedRoster = JSON.parse(savedRoster);
        setRoster(parsedRoster);
      }
      return true;
    } catch (error) {
      console.error("Error updating roster:", error);
      return false;
    }
  };

  const contextValue = {
    roster,
    addPokemon,
    removePokemon,
    isPokemonInRoster,
    rosterCount: roster.length,
    activePokemon,
    setActivePokemonForBattle,
    updateRoster,
    isInitialized,
  };

  console.log("RosterContext value:", contextValue);

  return (
    <RosterContext.Provider value={contextValue}>
      {children}
    </RosterContext.Provider>
  );
};

// Hook to use the context
export const useRoster = () => useContext(RosterContext);

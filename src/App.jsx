// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RosterProvider } from "./context/RosterContext";
import { CaughtPokemonProvider } from "./context/CaughtPokemonContext";
import AuthProvider from "./context/AuthContext";
import MyRoster from "./pages/MyRoster";
import BattlePage from "./pages/BattlePage";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Protected from "./components/Protected";
import PokemonDetails from "./pages/PokemonDetails";
import StarterSelection from "./pages/StarterSelection";
import Leaderboard from "./pages/Leaderboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CaughtPokemonProvider>
          <RosterProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route element={<Protected />}>
                  <Route
                    path="starter-selection"
                    element={<StarterSelection />}
                  />
                  <Route index element={<Homepage />} />
                  <Route path="roster" element={<MyRoster />} />
                  <Route path="battle" element={<BattlePage />} />
                  <Route path="pokemon/:id" element={<PokemonDetails />} />
                </Route>
              </Route>
            </Routes>
          </RosterProvider>
        </CaughtPokemonProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

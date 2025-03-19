// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RosterProvider } from "./context/RosterContext";
import MyRoster from "./pages/MyRoster";
import BattlePage from "./pages/BattlePage";
import Homepage from "./pages/Homepage";
// import Login from "./pages/Login";
import Layout from "./components/Layout";
// import Protected from "./components/Protected";
import PokemonDetails from "./pages/PokemonDetails";
import StarterSelection from "./pages/StarterSelection";
import Leaderboard from "./pages/Leaderboard";

const App = () => {
    return (
        <RosterProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <main className="container mx-auto px-4 py-6">
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route path="login" element={<Login />} />
                                <Route element={<Protected />}>
                                    <Route path="starter-selection" element={<StarterSelection />} />
                                    <Route index element={<Homepage />} />
                                    <Route path="roster" element={<MyRoster />} />
                                    <Route path="battle" element={<BattlePage />} />
                                    <Route path="pokemon/:id" element={<PokemonDetails />} />
                                </Route>
                            </Route>
                        </Routes>
                    </main>
                </div>
            </Router>
        </RosterProvider>
    );
};

export default App;

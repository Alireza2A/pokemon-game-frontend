// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { RosterProvider } from "./context/RosterContext";
import MyRoster from "./pages/MyRoster";
import BattlePage from "./pages/BattlePage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <RosterProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<MyRoster />} />
              <Route path="/roster" element={<MyRoster />} />
              <Route path="/battle" element={<BattlePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </RosterProvider>
  );
};

export default App;

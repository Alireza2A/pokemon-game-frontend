import { useState, useContext } from "react";
import { Link, useLocation } from "react-router";
import { useRoster } from "../context/RosterContext";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
    const { rosterCount } = useRoster();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { user, loading, logout } = useContext(AuthContext);

    // Check if a route is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-white font-bold text-xl">Pokémon Battle</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <NavLink to="/" isActive={isActive("/")}>
                            Home
                        </NavLink>
                        <NavLink
                            to="/roster"
                            isActive={isActive("/roster")}
                            badge={rosterCount > 0 ? rosterCount : null}
                        >
                            My Roster
                        </NavLink>
                        <NavLink to="/battle" isActive={isActive("/battle")}>
                            Battle
                        </NavLink>
                        <NavLink to="/leaderboard" isActive={isActive("/leaderboard")}>
                            Leaderboard
                        </NavLink>
                    </div>

                    {/* Battle Button */}
                    <div className="hidden md:block">
                        {rosterCount >= 3 ? (
                            <Link
                                to="/battle"
                                className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors"
                            >
                                Battle Now!
                            </Link>
                        ) : (
                            <span className="text-sm text-yellow-200">
                                Add {3 - rosterCount} more Pokémon to battle
                            </span>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-3 pb-5 border-t border-white/20">
                        <div className="flex flex-col space-y-3">
                            <MobileNavLink to="/" isActive={isActive("/")} onClick={() => setIsMenuOpen(false)}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink
                                to="/roster"
                                isActive={isActive("/roster")}
                                badge={rosterCount > 0 ? rosterCount : null}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My Roster
                            </MobileNavLink>
                            <MobileNavLink
                                to="/battle"
                                isActive={isActive("/battle")}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Battle
                            </MobileNavLink>
                            <MobileNavLink
                                to="/leaderboard"
                                isActive={isActive("/leaderboard")}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Leaderboard
                            </MobileNavLink>

                            {/* Mobile Battle Button */}
                            {rosterCount >= 3 ? (
                                <Link
                                    to="/battle"
                                    className="w-full px-4 py-2 mt-3 rounded-md bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Battle Now!
                                </Link>
                            ) : (
                                <span className="text-sm text-yellow-200 mt-2 text-center">
                                    Add {3 - rosterCount} more Pokémon to battle
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Desktop Nav Link Component
const NavLink = ({ children, to, isActive, badge }) => (
    <Link
        to={to}
        className={`relative flex items-center text-sm font-medium hover:text-white transition-colors ${
            isActive ? "text-white" : "text-white/80"
        }`}
    >
        {children}
        {badge && <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-400 text-gray-900 rounded-full">{badge}</span>}
        {isActive && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full" />}
    </Link>
);

// Mobile Nav Link Component
const MobileNavLink = ({ children, to, isActive, badge, onClick }) => (
    <Link
        to={to}
        className={`flex items-center justify-between px-3 py-2 text-base font-medium rounded-md ${
            isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
        }`}
        onClick={onClick}
    >
        <span>{children}</span>
        {badge && <span className="px-1.5 py-0.5 text-xs bg-yellow-400 text-gray-900 rounded-full">{badge}</span>}
    </Link>
);

export default Navbar;

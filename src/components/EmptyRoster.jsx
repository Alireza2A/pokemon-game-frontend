import { Link } from "react-router";

const EmptyRoster = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 mb-8 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="none"
          className="w-16 h-16 text-gray-400"
        >
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
          <line
            x1="16"
            y1="4"
            x2="16"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="16"
            y1="20"
            x2="16"
            y2="28"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="4"
            y1="16"
            x2="12"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="16"
            x2="28"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Your Roster is Empty
      </h2>
      <p className="text-gray-600 max-w-md mb-8">
        You haven't added any Pokémon to your roster yet. Browse the collection
        and add your favorites to build a team!
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
      >
        Explore Pokémon
      </Link>
    </div>
  );
};

export default EmptyRoster;

import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login() {
  const { user, loading, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Check if user has already selected a starter pokemon
  useEffect(() => {
    if (user && !loading) {
      // Check if the user has any pokemon in their roster
      const hasStarter = localStorage.getItem("hasSelectedStarter");

      if (hasStarter === "true") {
        navigate("/"); // Go to homepage if they already have a starter
      } else {
        navigate("/starter-selection"); // Go to starter selection if they don't
      }
    }
  }, [user, loading, navigate]);

  return (
    <>
      {!loading && (
        <>
          {user ? (
            // This will be handled by the useEffect above
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(login)}
              className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"
            >
              <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
              <label htmlFor="email" className="block mb-4">
                Email:
                <input
                  type="email"
                  placeholder="email"
                  {...register("email", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                />
              </label>

              {errors.email && (
                <p className="text-red-500 text-sm mb-4">
                  This field is required
                </p>
              )}

              <label htmlFor="password" className="block mb-4">
                Password:
                <input
                  type="password"
                  placeholder="password"
                  {...register("password", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                />
              </label>
              {errors.password && (
                <p className="text-red-500 text-sm mb-4">
                  This field is required
                </p>
              )}

              <input
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded
                                 hover:from-blue-800 hover:to-blue-900 cursor-pointer transition-all"
              />
            </form>
          )}
        </>
      )}
    </>
  );
}

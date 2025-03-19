import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext.jsx";
import { Navigate } from "react-router";

export default function Login() {
  const { user, loading, login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      {!loading && (
        <>
          {user ? (
            <Navigate to="/" />
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

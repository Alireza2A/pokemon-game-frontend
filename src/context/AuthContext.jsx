import React, { createContext, useContext, useState, useEffect} from 'react';
import { useNavigate } from "react-router";
import { getUserFromApi, profile } from "../data/users";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (formData) => {
    try {
      const data = await getUserFromApi(formData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await profile();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
      {/* Ensure ToastContainer is included so toasts work globally */}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;

//This calls useContext(AuthContext), which returns whatever value is provided in AuthContext.Provider
//Therefore useAuth actually returns the entire AuthContext value,
// which is an object containing user, signIn, and signOut.

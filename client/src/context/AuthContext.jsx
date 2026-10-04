import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";


const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      () =>
        localStorage.getItem(
          "netviz_token"
        )
    );

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // RESTORE SESSION
  // =====================================================

  useEffect(() => {
    const restoreSession =
      async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const data =
            await getCurrentUser(
              token
            );

          setUser(
            data.user
          );
        } catch (error) {
          localStorage.removeItem(
            "netviz_token"
          );

          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, [token]);


  // =====================================================
  // LOGIN
  // =====================================================

  const login = async ({
    email,
    password,
  }) => {
    const data =
      await loginUser({
        email,
        password,
      });

    localStorage.setItem(
      "netviz_token",
      data.token
    );

    setToken(
      data.token
    );

    setUser(
      data.user
    );

    return data;
  };


  // =====================================================
  // REGISTER
  // =====================================================

  const register = async ({
    name,
    email,
    password,
  }) => {
    const data =
      await registerUser({
        name,
        email,
        password,
      });

    localStorage.setItem(
      "netviz_token",
      data.token
    );

    setToken(
      data.token
    );

    setUser(
      data.user
    );

    return data;
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "netviz_token"
    );

    setToken(null);
    setUser(null);
  };


  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    setUser,
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(
    AuthContext
  );
};
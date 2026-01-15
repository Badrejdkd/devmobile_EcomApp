import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import {
  signIn,
  signUp,
  signOut,
  getCurrentSession,
} from "../supabase/auth";

/**
 * 🔐 EMAIL ADMIN (Option B)
 * Change-le par l’email admin réel
 */
const ADMIN_EMAIL = "admin@shoppro.com";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      setIsAdmin(currentSession?.user?.email === ADMIN_EMAIL);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setIsAdmin(newSession?.user?.email === ADMIN_EMAIL);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ---------------- AUTH ACTIONS ---------------- */

  const login = async (email, password) => {
    await signIn(email, password);
  };

  const register = async (fullName, email, password) => {
    await signUp(email, password, fullName);
  };

  const logout = async () => {
    await signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isAdmin, // ⭐ IMPORTANT POUR ADMIN
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

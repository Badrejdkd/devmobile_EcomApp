import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { signIn, signUp, signOut, getCurrentSession } from '../supabase/authService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const current = await getCurrentSession();
      setSession(current);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    await signIn(email, password);
  };

  const register = async (fullName, email, password) => {
    await signUp(email, password, fullName);
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { supabase } from "./client";

export const signUp = async (email, password, fullName) => {
  // 1️⃣ Création du compte auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, 
      },
    },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) return data;

  // 2️⃣ UPSERT dans profiles (pas d’erreur si existe déjà)
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
    });

  if (profileError) throw profileError;

  return data;
};

/**
 * ================= CONNEXION =================
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * ================= DÉCONNEXION =================
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * ================= SESSION =================
 */
export const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session;
};

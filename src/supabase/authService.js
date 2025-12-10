import { supabase } from './client';

/**
 * Inscription utilisateur + insertion dans la table profiles
 */
export const signUp = async (email, password, fullName) => {
  // 1️⃣ Création du compte auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName } // metadata stockée dans auth.users
    }
  });

  if (error) throw error;

  // 2️⃣ Insertion dans la table profiles
  if (data.user) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,  // même ID que auth.users
          full_name: fullName
        }
      ]);

    if (insertError) throw insertError;
  }

  return data;
};

/**
 * Connexion utilisateur
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data; // session + user
};

/**
 * Déconnexion utilisateur
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Récupération session actuelle
 */
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  return data.session;
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please click the "Connect to Supabase" button in the top right corner to set up your Supabase project.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SignUpData {
  firstName: string;
  lastName: string;
  phone: string;
}

export const signUp = async (email: string, password: string, userData?: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  // Special case for admin login
  if (email === 'admin') {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'admin123'
    });
    if (error) throw error;
    return data;
  }

  // Regular user login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { ...user, ...profile };
};

// Cart functions
export const saveCartItem = async (userId: string, item: any) => {
  const { error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      shoe_id: item.shoe.id,
      size: item.size,
      quantity: item.quantity,
      region: item.region
    });
  
  if (error) throw error;
};

export const getCartItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const removeCartItem = async (itemId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
};
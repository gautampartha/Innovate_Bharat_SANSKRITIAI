import { supabase } from "@/lib/supabase";

export const authClient = {
  signUp: async (email: string, password: string, full_name: string, phone: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone },
      },
    });
  },
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },
  signOut: async () => {
    return supabase.auth.signOut();
  },
  session: async () => {
    return supabase.auth.getSession();
  },
};

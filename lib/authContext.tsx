"use client";

import { authClient } from "@/lib/authClient";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (!error && data) {
      setProfile({
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        user_type: data.user_type,
        language: data.language,
        total_xp: data.total_xp ?? 0,
        monuments_visited: data.monuments_visited ?? [],
        quiz_scores: data.quiz_scores ?? {},
        chat_history: data.chat_history ?? [],
      });
    }
  };

  useEffect(() => {
    authClient.session().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) refreshProfile();
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) refreshProfile();
      else setProfile(null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      refreshProfile,
      setProfile,
      signIn: async (email, password) => {
        const { error } = await authClient.signIn(email, password);
        if (error) throw error;
        await refreshProfile();
      },
      signUp: async (email, password, fullName, phone) => {
        const { error } = await authClient.signUp(email, password, fullName, phone);
        if (error) throw error;
        await refreshProfile();
      },
      signOut: async () => {
        const { error } = await authClient.signOut();
        if (error) throw error;
        setProfile(null);
      },
    }),
    [user, session, loading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

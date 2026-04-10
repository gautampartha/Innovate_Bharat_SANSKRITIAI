"use client";

import { badgesFromXp, levelFromXp } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const USER_TYPES = {
  student: {
    icon: '🎓',
    color: '#534AB7',
    bg: 'rgba(83,74,183,0.1)',
    border: 'rgba(83,74,183,0.4)',
    content_focus: ['academic_focus', 'historical_context', 'research_material'],
    recommended_duration: '45-60 mins',
    subtitle: 'Academic & Deep-dive Mode',
    label: 'Student'
  },
  tourist: {
    icon: '📸',
    color: '#C9A84C',
    bg: 'rgba(201,168,76,0.1)',
    border: 'rgba(201,168,76,0.4)',
    content_focus: ['highlights_focus', 'storytelling_narrative', 'photography_stops'],
    recommended_duration: '20-30 mins',
    subtitle: 'Quick Highlights & Stories',
    label: 'Tourist'
  }
} as const;

export type UserType = keyof typeof USER_TYPES;

type UserContextValue = {
  profile: UserProfile | null;
  level: string;
  badges: ReturnType<typeof badgesFromXp>;
  refreshProfile: () => Promise<void>;
  addXpLocal: (xp: number, monumentId?: string) => Promise<void>;
  userType: UserType;
  setUserType: (type: UserType) => void;
  userConfig: typeof USER_TYPES[UserType];
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType>('tourist');

  const userConfig = useMemo(() => USER_TYPES[userType], [userType]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('sanskriti_user_type') as UserType : null;
    if (saved && USER_TYPES[saved]) {
      setUserType(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sanskriti_user_type', userType);
    }
  }, [userType]);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
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
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addXpLocal = async (xp: number, monumentId?: string) => {
    if (!profile || !user) return;

    const next = {
      ...profile,
      total_xp: (profile.total_xp ?? 0) + xp,
      monuments_visited: monumentId
        ? Array.from(new Set([...(profile.monuments_visited ?? []), monumentId]))
        : profile.monuments_visited,
    };

    setProfile(next);

    await supabase
      .from("user_profiles")
      .update({
        total_xp: next.total_xp,
        monuments_visited: next.monuments_visited,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  };

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      level: levelFromXp(profile?.total_xp ?? 0),
      badges: badgesFromXp(profile?.total_xp ?? 0),
      refreshProfile,
      addXpLocal,
      userType,
      setUserType,
      userConfig,
    }),
    [profile, userType, userConfig],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'artist' | 'venue' | null
  const [loading, setLoading] = useState(true);

  // Helper function to fetch profiles based on auth user ID
  const fetchUserProfile = async (userId) => {
    try {
      // 1. Try fetching from artists table
      const { data: artistData, error: artistError } = await supabase
        .from("artists")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (artistData) {
        setProfile(artistData);
        setUserRole("artist");
        return;
      }

      // 2. Try fetching from venues table
      const { data: venueData, error: venueError } = await supabase
        .from("venues")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (venueData) {
        setProfile(venueData);
        setUserRole("venue");
        return;
      }

      // If no profile found in either, set to null
      setProfile(null);
      setUserRole(null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setProfile(null);
      setUserRole(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Get current session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error("Session initialization failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // SignUp function: registers in Auth and then inserts profile details
  const signUp = async (email, password, role, profileData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data?.user) throw new Error("SignUp failed: No user returned");

      const userId = data.user.id;

      if (role === "artist") {
        const { error: profileError } = await supabase.from("artists").insert([
          {
            id: userId,
            artist_name: profileData.name,
            genre: profileData.genre,
            location: profileData.location,
            region: profileData.region,
            contact_email: email,
            verified: false,
            rates_locked: false,
            image: profileData.image || "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80",
            photo_url: profileData.image || "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80",
            youtube_link: profileData.youtubeLink || "",
            new_release: profileData.newRelease || "",
          },
        ]);
        if (profileError) throw profileError;
      } else if (role === "venue") {
        const { error: profileError } = await supabase.from("venues").insert([
          {
            id: userId,
            venue_name: profileData.name,
            location: profileData.location,
            region: profileData.region,
            contact_number: profileData.contactNumber || "",
            capacity: parseInt(profileData.capacity) || null,
            image: profileData.image || "https://images.unsplash.com/photo-1514525253361-bee8a4874093?w=1200&q=80",
          },
        ]);
        if (profileError) throw profileError;
      }

      // Re-fetch profile to bind state locally
      await fetchUserProfile(userId);
      return { data, error: null };
    } catch (err) {
      console.error("SignUp error inside AuthContext:", err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // SignIn function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data?.user) {
        await fetchUserProfile(data.user.id);
      }
      return { data, error: null };
    } catch (err) {
      console.error("SignIn error inside AuthContext:", err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // SignOut function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setUserRole(null);
    } catch (err) {
      console.error("SignOut error:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => user && fetchUserProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

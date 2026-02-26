import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";

interface User {
  id: number;
  email: string;
  created_at?: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

interface Session {
  user: User;
  token: string | null;
}

interface AuthError {
  message: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data, error } = await api.auth.getUser();
      if (data && !error) {
        setUser(data.user);
        setProfile(data.profile);
        setSession({
          user: data.user,
          token: localStorage.getItem("auth_token"),
        });
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = api.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        if (session.user && !profile) {
          api.profile
            .get()
            .then((profileData) => {
              setProfile(profileData);
            })
            .catch(console.error);
        }
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [profile]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await api.auth.signUp(email, password, name);

      if (error) {
        return { error };
      }

      if (data) {
        setUser(data.user);
        setProfile(data.profile);
        setSession({ user: data.user, token: data.token });
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await api.auth.signIn(email, password);

      if (error) {
        return { error };
      }

      if (data) {
        setUser(data.user);
        setProfile(data.profile);
        setSession({ user: data.user, token: data.token });
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    await api.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

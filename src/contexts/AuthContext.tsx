import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const DEMO_KEY = "life-dashboard-demo-mode";

const demoUser = {
  id: "demo-user",
  email: "demo@lifedashboard.app",
  user_metadata: { display_name: "Demo" },
  app_metadata: {},
  aud: "demo",
  created_at: new Date().toISOString(),
} as unknown as User;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  startDemo: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isDemo: false,
  startDemo: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(() => {
    try {
      return localStorage.getItem(DEMO_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const startDemo = () => {
    try {
      localStorage.setItem(DEMO_KEY, "true");
    } catch {
      // ignore storage failures
    }
    setIsDemo(true);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_KEY);
    } catch {
      // ignore storage failures
    }
    setIsDemo(false);
    await supabase.auth.signOut();
  };

  const user = session?.user ?? (isDemo ? demoUser : null);

  return (
    <AuthContext.Provider value={{ session, user, loading: loading && !isDemo, isDemo, startDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "signup" | "reset";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { startDemo } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setMessage("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage("Check your email for a password reset link.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/favicon.png" alt="Life Dashboard" className="w-14 h-14 mx-auto mb-4" />
          <h1 className="font-display text-3xl text-foreground">Life Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personal memory vault</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
          <h2 className="font-display text-xl text-foreground mb-5">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            {mode !== "reset" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
            {message && <p className="text-xs text-secondary">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                startDemo();
                navigate("/");
              }}
              className="w-full border border-primary/40 text-foreground rounded-full py-2.5 text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              Continue as Guest (Demo)
            </button>
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              Explore the full dashboard with sample memories. Nothing is saved.
            </p>
          </div>



          <div className="mt-4 text-center space-y-2">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("reset")} className="text-xs text-muted-foreground hover:text-foreground">
                  Forgot password?
                </button>
                <p className="text-xs text-muted-foreground">
                  No account?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">
                    Sign up
                  </button>
                </p>
              </>
            )}
            {mode !== "login" && (
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/60 text-center mt-6">
          🔒 All entries are private and encrypted.
        </p>
      </div>
    </div>
  );
}

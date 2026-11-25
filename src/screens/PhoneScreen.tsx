import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authClient } from "../lib/auth-client";
import { Button } from "../components/Button";

export function EmailSignInScreen({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { setAuthError, authError, setAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setAuthError("");
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });
      if (error) {
        setAuthError(error.message || "Sign in failed. Please try again.");
        return;
      }
      setAuthenticated(true);
      navigate("/profile-setup");
    } catch (err: any) {
      setAuthError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content">
      <header className="topbar">
        <div className="flex items-center gap-1 min-w-[44px]">
          <button className="icon-button" aria-label="Go back" onClick={onBack ?? (() => navigate(-1))}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
        </div>
        <div className="flex-1 text-center">
          <span className="topbar__title">Sign in</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 min-w-[44px]" />
      </header>

      <section>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to your account</h1>
        <p>Enter your email and password to continue.</p>
      </section>

      <form className="stack">
        <label className="auth-field">
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError("");
            }}
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError("");
            }}
          />
        </label>

        {authError && (
          <p className="text-xs font-bold text-black">{authError}</p>
        )}

        <div className="mt-auto pt-6 stack">
          <Button disabled={loading} onClick={() => signIn()}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/sign-up")}
          >
            Create an account
          </Button>
        </div>
      </form>
    </main>
  );
}

export { EmailSignInScreen as PhoneScreen };

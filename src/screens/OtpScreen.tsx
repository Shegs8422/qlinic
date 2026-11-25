import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authClient } from "../lib/auth-client";
import { Button } from "../components/Button";

export function EmailSignUpScreen({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { setAuthError, authError, setAuthenticated, setFullName, setEmail } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setAuthError("");
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) {
        setAuthError(error.message || "Sign up failed. Please try again.");
        return;
      }
      setAuthenticated(true);
      setFullName(name);
      setEmail(email);
      navigate("/profile-setup");
    } catch (err: any) {
      setAuthError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="content items-center justify-center py-20">
        <span className="t-shimmer" data-text="Creating account…">
          Creating account…
        </span>
      </main>
    );
  }

  return (
    <main className="content">
      <header className="topbar">
        <div className="flex items-center gap-1 min-w-[44px]">
          <button className="icon-button" aria-label="Go back" onClick={onBack ?? (() => navigate(-1))}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
        </div>
        <div className="flex-1 text-center">
          <span className="topbar__title">Create account</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 min-w-[44px]" />
      </header>

      <section>
        <span className="eyebrow">NEW ACCOUNT</span>
        <h1>Create your account</h1>
        <p>Sign up with your email address to get started.</p>
      </section>

      <form className="stack">
        <label className="auth-field">
          <span>Full name</span>
          <input
            autoComplete="name"
            placeholder="e.g. Amina Kamau"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setAuthError("");
            }}
          />
        </label>

        <label className="auth-field">
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmailLocal(e.target.value);
              setAuthError("");
            }}
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="•••••••• (min 8 characters)"
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
          <Button disabled={loading} onClick={() => signUp()}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/sign-in")}
          >
            Already have an account? Sign in
          </Button>
        </div>
      </form>
    </main>
  );
}

export { EmailSignUpScreen as OtpScreen };

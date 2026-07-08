import { useState } from "react";
import { Input } from "../ui/Input";
import { useAuth } from "../../context/AuthContext";

/**
 * Full-screen login / register gate. Shown whenever no user is authenticated.
 * Toggles between "Sign in" and "Create account" (self-registration creates an
 * OPERATOR account).
 */
export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password, organizationName);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-wms-bg px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-wms-purple text-white text-xl font-bold mb-3">
            W
          </div>
          <h1 className="text-2xl font-semibold text-wms-text">WMS Portal</h1>
          <p className="text-sm text-wms-muted mt-1">
            {isRegister ? "Create your account" : "Sign in to continue"}
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-wms-border rounded-2xl p-6 shadow-sm flex flex-col gap-4"
        >
          {isRegister && (
            <>
              <Input
                id="name"
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
              <Input
                id="organizationName"
                label="Organization / Warehouse name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Acme Warehouse"
              />
            </>
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p className="text-sm text-wms-red bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-wms-purple text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Please wait…"
              : isRegister
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-wms-muted mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? "login" : "register");
              setError("");
            }}
            className="text-wms-purple font-medium hover:underline"
          >
            {isRegister ? "Sign in" : "Create one"}
          </button>
        </p>

        {/* Demo hint */}
        {!isRegister && (
          <div className="mt-6 text-center text-xs text-wms-muted/80 leading-relaxed">
            <p className="font-medium text-wms-muted">Demo accounts (password: password123)</p>
            <p>admin@wms.dev · operator@wms.dev · quality@wms.dev</p>
          </div>
        )}
      </div>
    </div>
  );
}

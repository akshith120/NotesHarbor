import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = mode === "register" ? { username, email, password } : { email, password };
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, payload);

      login(res.data);
      toast.success(mode === "register" ? "Account created" : "Welcome back");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="page-container flex min-h-screen items-center py-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="panel overflow-hidden p-8 sm:p-10">
            <span className="pill">NotesHarbor access</span>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Keep your notes private and easy to revisit.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Sign in or create an account to save your notes, organize tags, and use the workspace.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">What you get</p>
              <p className="mt-2 text-sm text-slate-600">
                A simple, private notes workspace with tag chips and AI tools you can switch on when you need them.
              </p>
            </div>
          </section>

          <section className="panel p-8 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="pill">{mode === "login" ? "Welcome back" : "Create account"}</span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                  {mode === "login" ? "Sign in to continue" : "Start your workspace"}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login" ? "Need an account?" : "Have an account?"}
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div>
                  <label className="field-label">Username</label>
                  <input
                    className="field-input mt-2"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname"
                  />
                </div>
              )}

              <div>
                <label className="field-label">Email</label>
                <input
                  className="field-input mt-2"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="field-label">Password</label>
                <input
                  className="field-input mt-2"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="primary-btn w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col overflow-y-auto">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 text-xs tracking-[0.35em] uppercase">
        <span>Volatility Engine</span>

        <div className="flex gap-8 text-white/30">
          <a className="hover:text-white">Markets</a>
          <a className="hover:text-white">Analytics</a>
          <a className="hover:text-white">Signals</a>
        </div>
      </nav>

      <div className="h-px bg-white/10 mx-6" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-[320px]">

          {/* Header */}
          <div className="mb-8">
            <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-3">
              Dashboard — Sign In
            </p>

            <h1 className="text-3xl font-light leading-tight">
              Welcome <br /> back.
            </h1>
          </div>

          {!submitted ? (
            <>
              {/* Email */}
              <div className="mb-6">

                <div
                  className={`border-b pb-2 transition ${
                    focused === "email"
                      ? "border-white/40"
                      : "border-white/15"
                  }`}
                >
                  <label className="block text-[9px] tracking-[0.35em] uppercase text-white/30 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">

                <div
                  className={`border-b pb-2 transition ${
                    focused === "password"
                      ? "border-white/40"
                      : "border-white/15"
                  }`}
                >
                  <label className="block text-[9px] tracking-[0.35em] uppercase text-white/30 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <a className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60">
                    Forgot?
                  </a>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full border border-white/20 py-3 text-[11px] tracking-[0.3em] uppercase hover:border-white/50 hover:bg-white/5 transition mb-6"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="px-4 text-[10px] tracking-[0.3em] uppercase text-white/30">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social */}
              <div className="flex gap-2 mb-8">
                <button className="flex-1 border border-white/10 py-2 text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white hover:border-white/30 transition">
                  Google
                </button>

                <button className="flex-1 border border-white/10 py-2 text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white hover:border-white/30 transition">
                  GitHub
                </button>
              </div>

              {/* Register */}
              <div className="text-center text-[11px] tracking-[0.15em]">
                <span className="text-white/30">No account? </span>
                <a className="text-white/50 hover:text-white">
                  Request Access →
                </a>
              </div>
            </>
          ) : (
            <div>
              <p className="text-white/50 text-sm leading-relaxed">
                Authenticated. Redirecting <br /> to your dashboard.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-white/10 mx-6" />

      <footer className="px-6 py-4 flex justify-between text-[10px] text-white/30 uppercase tracking-[0.3em]">
        <span>© 2026 Volatility Engine</span>
        <span>Not financial advice</span>
      </footer>
    </main>
  );
}
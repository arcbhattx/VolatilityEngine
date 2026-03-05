"use client";
import { useState } from "react";

export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordMismatch =
    confirm.length > 0 && password !== confirm;

  const handleSubmit = () => {

    if (!agreed || passwordMismatch) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
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

      <div className="flex-1 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-[320px]">

          {/* Header */}
          <div className="mb-8">
            <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-3">
              Dashboard — Create Account
            </p>

            <h1 className="text-3xl font-light leading-tight">
              Request <br /> access.
            </h1>
          </div>

          {!submitted ? (
            <>
              {/* Name */}
              <Field
                label="Full Name"
                value={name}
                setValue={setName}
                id="name"
                focused={focused}
                setFocused={setFocused}
              />

              {/* Email */}
              <Field
                label="Email"
                value={email}
                setValue={setEmail}
                id="email"
                focused={focused}
                setFocused={setFocused}
              />

              {/* Password */}
              <Field
                label="Password"
                value={password}
                setValue={setPassword}
                id="password"
                type="password"
                focused={focused}
                setFocused={setFocused}
              />

              {/* Confirm */}
              <Field
                label="Confirm Password"
                value={confirm}
                setValue={setConfirm}
                id="confirm"
                type="password"
                focused={focused}
                setFocused={setFocused}
              />

              {passwordMismatch && (
                <p className="text-red-400 text-[10px] tracking-[0.25em] uppercase mb-4">
                  Passwords do not match
                </p>
              )}

              {/* Terms */}
              <div className="flex gap-3 mb-6 items-start">

                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="mt-1"
                />

                <span className="text-xs text-white/40">
                  I agree to the Terms and Privacy Policy
                </span>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!agreed || passwordMismatch || loading}
                className="w-full border border-white/20 py-3 text-[11px] tracking-[0.3em] uppercase hover:border-white/50 hover:bg-white/5 transition mb-6"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <div className="text-center text-[11px] tracking-[0.15em]">
                <span className="text-white/30">
                  Already have an account?
                </span>{" "}
                <a className="text-white/50 hover:text-white">
                  Sign In →
                </a>
              </div>
            </>
          ) : (
            <p className="text-white/50 text-sm leading-relaxed">
              Account created. Check your email to verify.
            </p>
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

function Field({
  label,
  value,
  setValue,
  id,
  focused,
  setFocused,
  type = "text"
}: any) {

  return (
    <div className="mb-6">

      <div
        className={`border-b pb-2 transition ${
          focused === id
            ? "border-white/40"
            : "border-white/15"
        }`}
      >
        <label className="block text-[9px] tracking-[0.35em] uppercase text-white/30 mb-2">
          {label}
        </label>

        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          className="w-full bg-transparent outline-none text-sm placeholder:text-white/20"
        />
      </div>
    </div>
  );
}
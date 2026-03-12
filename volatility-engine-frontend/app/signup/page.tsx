"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../api-hooks/authentication";
import Toast from "../components/reusable/Toast";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<any>(null);

  const passwordMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async () => {
    if (passwordMismatch) return;

    setLoading(true);

    try {
      await createUser(email, password);

      setToast({
        message: "Account created",
        type: "success",
      });

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err: any) {
      setToast({
        message: err.message || "Signup failed",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[320px]">
          <div className="mb-6">
            <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-2">
              Dashboard — Create Account
            </p>

            <h1 className="text-3xl font-light">Request access</h1>
          </div>

          <Field
            label="Email"
            value={email}
            setValue={setEmail}
            id="email"
            focused={focused}
            setFocused={setFocused}
          />

          <Field
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
            id="password"
            focused={focused}
            setFocused={setFocused}
          />

          <Field
            label="Confirm Password"
            type="password"
            value={confirm}
            setValue={setConfirm}
            id="confirm"
            focused={focused}
            setFocused={setFocused}
          />

          {passwordMismatch && (
            <p className="text-red-400 text-[10px] mb-3">
              Passwords do not match
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || passwordMismatch}
            className="w-full border border-white/20 py-3 text-[11px] tracking-[0.3em] uppercase hover:border-white/50 hover:bg-white/5 transition mb-4"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="text-center text-[11px]">
            <span className="text-white/30">Already have an account?</span>{" "}
            <a
              onClick={() => router.push("/login")}
              className="text-white/60 hover:text-white cursor-pointer"
            >
              Sign in →
            </a>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
  type = "text",
}: any) {
  return (
    <div className="mb-5">
      <div
        className={`border-b pb-2 transition ${
          focused === id ? "border-white/40" : "border-white/15"
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
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}

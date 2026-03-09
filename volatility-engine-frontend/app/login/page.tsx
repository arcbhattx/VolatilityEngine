"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../api-hooks/authentication";
import Toast from "../components/reusable/Toast";
import { useAuth } from "../context/authContext";

export default function Login() {

  const router = useRouter();
  const {login} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<any>(null);

   const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);

      login(res.access_token);

      setToast({ message: "Login successful", type: "success" });

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: any) {
      setToast({ message: err.message || "Login failed", type: "error" });
    }
    setLoading(false);
  };


  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col">

      <div className="flex-1 flex items-center justify-center px-6">

        <div className="w-full max-w-[320px]">

          <div className="mb-6">
            <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-2">
              Dashboard — Sign In
            </p>

            <h1 className="text-3xl font-light">
              Welcome back
            </h1>
          </div>

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
            type="password"
            value={password}
            setValue={setPassword}
            id="password"
            focused={focused}
            setFocused={setFocused}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full border border-white/20 py-3 text-[11px] tracking-[0.3em] uppercase hover:border-white/50 hover:bg-white/5 transition mb-4"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <div className="text-center text-[11px]">
            <span className="text-white/30">No account?</span>{" "}
            <a
              onClick={() => router.push("/signup")}
              className="text-white/60 hover:text-white cursor-pointer"
            >
              Create one →
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
  type = "text"
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
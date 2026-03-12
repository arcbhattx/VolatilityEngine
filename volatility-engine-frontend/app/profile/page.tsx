"use client";

import { useState } from "react";

const Icon = ({ d, size = 15 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  camera:
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
};

export default function Profile() {
  const [name, setName] = useState("James Dorsey");
  const [email, setEmail] = useState("james@volatilityengine.io");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-mono flex flex-col">
      <header className="h-16 border-b border-white/[0.06] flex items-center px-8">
        <span className="text-[9px] tracking-[0.45em] uppercase text-white/20">
          Profile Settings
        </span>
      </header>

      <div className="max-w-md w-full mx-auto px-8 py-12 flex flex-col gap-px">
        {/* Avatar */}
        <div className="border border-white/[0.06] p-8 flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-20 h-20 border border-white/15 bg-white/[0.03] flex items-center justify-center text-xl font-light text-white/50 overflow-hidden">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                "JD"
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Icon d={Icons.camera} size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
            </label>
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">
            Click to upload
          </span>
        </div>

        {/* Name */}
        <div className="border border-white/[0.06] p-6 flex flex-col gap-3">
          <label className="text-[9px] tracking-[0.4em] uppercase text-white/20">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border border-white/10 text-white/70 text-xs tracking-wider px-3 py-2.5 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="border border-white/[0.06] p-6 flex flex-col gap-3">
          <label className="text-[9px] tracking-[0.4em] uppercase text-white/20">
            Email Address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border border-white/10 text-white/70 text-xs tracking-wider px-3 py-2.5 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Password */}
        <div className="border border-white/[0.06] p-6 flex flex-col gap-3">
          <label className="text-[9px] tracking-[0.4em] uppercase text-white/20">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent border border-white/10 text-white/70 text-xs tracking-wider px-3 py-2.5 outline-none focus:border-white/30 transition-colors pr-10 placeholder:text-white/20"
            />
            <button
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer"
            >
              <Icon d={showPassword ? Icons.eyeOff : Icons.eye} size={13} />
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="bg-transparent border border-white/10 text-white/70 text-xs tracking-wider px-3 py-2.5 outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
          />
        </div>

        {/* Save */}
        <button className="border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/30 text-white/60 hover:text-white/90 text-[10px] tracking-[0.4em] uppercase py-3.5 transition-all duration-200 cursor-pointer mt-px">
          Save Changes
        </button>
      </div>
    </div>
  );
}

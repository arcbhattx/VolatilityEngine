"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { useLogin } from "../../api-hooks/auth";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-6 bg-green-400 rounded-full" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
        </div>
        <p className="text-zinc-500 text-sm">Enter your credentials to access your dashboard</p>
      </div>

      <div className="space-y-4">
        {/* Social Provider */}
        <button className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50" disabled={loading}>
          <Chrome size={20} />
          Sign in with Google
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="flex-shrink mx-4 text-zinc-600 text-xs uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-black/50 border border-white/[0.06] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-green-400/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Password</label>
              <button type="button" className="text-xs text-green-400/80 hover:text-green-400 transition-colors">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/[0.06] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-green-400/50 transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 font-semibold py-3 rounded-xl hover:bg-green-500/20 transition-all mt-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-400 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

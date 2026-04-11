"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./context/authContext";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { continueAsGuest } = useAuth();

  const onClickGetStarted = () => {
    router.push("/login");
  };

  const onClickContinueAsGuest = () => {
    continueAsGuest();
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-8 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-md py-6" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-white text-xs tracking-[0.4em] uppercase font-light">
            Volatility Engine
          </span>
        </div>
        <button
          onClick={onClickGetStarted}
          className="text-white text-[10px] tracking-[0.3em] uppercase hover:opacity-60 transition-opacity"
        >
          Sign In →
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-32 px-8 md:px-12 max-w-5xl">
        <h1 className="text-[clamp(2.5rem,7vw,7rem)] font-light leading-[1.1] tracking-tight text-white mb-12">
          Predict market risk
          <br />
          <span className="text-white/30">with precision.</span>
        </h1>
        
        <p className="text-white/40 text-lg md:text-xl leading-relaxed font-light max-w-2xl mb-16">
          Advanced volatility forecasting powered by stacked LSTM neural networks. 
          We transform historical price data into actionable 7-day risk trajectories.
        </p>

        <div className="flex flex-wrap gap-8 items-center">
          <button
            onClick={onClickGetStarted}
            className="px-12 py-5 bg-white text-black text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white/90 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={onClickContinueAsGuest}
            className="px-12 py-5 border border-white/20 text-white text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white/5 transition-all"
          >
            Continue as Guest
          </button>
          <div className="flex items-center gap-3 bg-white/5 py-3 px-5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/40 text-[9px] tracking-[0.4em] uppercase">Live Engine Active</span>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="px-8 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/10">
        {[
          { label: "VIX", value: "18.42", change: "+1.3%" },
          { label: "IV Rank", value: "67.2", change: "+4.1%" },
          { label: "Skew", value: "128.4", change: "−0.02" },
          { label: "HV 30D", value: "21.7%", change: "+0.9%" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-white/30 text-[9px] tracking-[0.4em] uppercase">{stat.label}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-white text-2xl font-light tabular-nums">{stat.value}</span>
              <span className="text-[10px] text-white/20">{stat.change}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Capabilities */}
      <section className="px-8 md:px-12 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {[
            {
              title: "Neural Forecasting",
              desc: "Predictive 7-day risk models utilizing stacked LSTM networks to capture temporal market dependencies.",
            },
            {
              title: "Surface Modeling",
              desc: "Implied volatility surface construction using SVI and SABR models, updated in real-time.",
            },
            {
              title: "Risk Attribution",
              desc: "Deep portfolio Greeks and scenario-based P&L analysis across correlated volatility regimes.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-6">
              <div className="h-px w-10 bg-white/20" />
              <h3 className="text-white text-base tracking-wide font-light">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-12 py-32 text-center">
        <div className="max-w-3xl mx-auto py-24 border border-white/10 relative overflow-hidden group">
          <div className="relative z-10 px-8">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-10">
              Ready to trade smarter?
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                 onClick={onClickGetStarted}
                className="px-12 py-5 bg-white text-black text-[11px] tracking-[0.4em] uppercase font-bold hover:scale-105 transition-all"
              >
                Sign In
              </button>
              <button
                 onClick={onClickContinueAsGuest}
                className="px-12 py-5 border border-white/20 text-white text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-white/5 transition-all"
              >
                Explore as Guest
              </button>
            </div>
          </div>
          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-12 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-white/20 text-[9px] tracking-[0.4em] uppercase">© 2026 Volatility Engine</span>
        <div className="flex gap-8 text-white/20 text-[9px] tracking-[0.2em] uppercase">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <span className="italic">Not financial advice.</span>
        </div>
      </footer>
    </main>
  );
}

'use client'

import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();

  const onClickGetStarted = ( () =>{
    router.push("/login")
  })


  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-8">
        <span className="text-white text-sm tracking-[0.4em] uppercase font-light">
          Volatility Engine
        </span>
        <div className="flex items-center gap-10">
          {["Markets", "Analytics", "Signals"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-white/30 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <button
          onClick={onClickGetStarted}
           className="px-5 py-2 border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-12 pt-24 pb-32">
        <div className="max-w-5xl">
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-10">
            Professional Trading Intelligence
          </p>
          <h1 className="text-[clamp(4rem,10vw,9rem)] font-light leading-[0.9] tracking-tight text-white mb-10">
            See the
            <br />
            <span className="italic text-white/20">market</span>
            <br />
            clearly.
          </h1>
          <div className="flex items-end justify-between mt-16">
            <p className="text-white/30 text-sm leading-relaxed max-w-sm font-light">
              Institutional-grade volatility analytics built for traders who
              operate at the edge of information.
            </p>
            <button onClick={onClickGetStarted}
            className="px-10 py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-white/80 transition-colors duration-300">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/8 mx-12" />

      {/* Stats row */}
      <section className="px-12 py-12 flex items-center gap-16">
        {[
          { label: "VIX", value: "18.42", change: "+1.3%" },
          { label: "IV Rank", value: "67.2", change: "+4.1%" },
          { label: "Put / Call", value: "0.84", change: "−0.02" },
          { label: "HV 30D", value: "21.7%", change: "+0.9%" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-white/25 text-xs tracking-[0.3em] uppercase">
              {stat.label}
            </span>
            <span className="text-white text-2xl font-light">{stat.value}</span>
            <span
              className={`text-xs ${stat.change.startsWith("−") ? "text-white/30" : "text-white/50"}`}
            >
              {stat.change}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-white/25 text-xs tracking-[0.3em] uppercase">
            Live
          </span>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/8 mx-12" />

      {/* Features */}
      <section className="px-12 py-24 grid grid-cols-3 gap-16">
        {[
          {
            num: "01",
            title: "Real-Time Signals",
            desc: "Sub-millisecond volatility signal detection across all major asset classes with configurable alert thresholds.",
          },
          {
            num: "02",
            title: "Surface Modeling",
            desc: "Full implied volatility surface construction using SVI and SABR models, updated tick-by-tick.",
          },
          {
            num: "03",
            title: "Risk Attribution",
            desc: "Decompose portfolio Greeks and scenario-based P&L attribution across correlated volatility regimes.",
          },
        ].map((card) => (
          <div key={card.num} className="group">
            <span className="text-white/15 text-xs tracking-[0.4em] block mb-8">
              {card.num}
            </span>
            <h3 className="text-white text-lg font-light mb-4 tracking-wide">
              {card.title}
            </h3>
            <p className="text-white/30 text-sm leading-relaxed font-light">
              {card.desc}
            </p>
            <div className="mt-8 h-px w-8 bg-white/20 group-hover:w-16 transition-all duration-500" />
          </div>
        ))}
      </section>

      {/* Divider */}
      <div className="h-px bg-white/8 mx-12" />

      {/* CTA */}
      <section className="px-12 py-28 flex items-center justify-between">
        <h2 className="text-5xl font-light text-white leading-tight">
          Ready to trade
          <br />
          <span className="text-white/20 italic">with clarity?</span>
        </h2>
        <div className="flex flex-col items-end gap-4">
          <button className="px-10 py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-white/80 transition-colors duration-300">
            Get Started
          </button>
          <a
            href="#"
            className="text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors duration-300"
          >
            View Documentation →
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="h-px bg-white/8 mx-12" />
      <footer className="px-12 py-8 flex items-center justify-between">
        <span className="text-white/20 text-xs tracking-[0.3em] uppercase">
          © 2026 Volatility Engine
        </span>
        <span className="text-white/15 text-xs">Not financial advice.</span>
      </footer>
    </main>
  );
}

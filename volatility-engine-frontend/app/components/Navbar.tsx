export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-6 border-b border-white/10">
      <h1 className="text-white font-semibold text-lg tracking-wide">
        Volatility Engine
      </h1>

      <div className="flex gap-8 text-white/80 text-sm">
        <a href="#" className="hover:text-white">
          Markets
        </a>
        <a href="#" className="hover:text-white">
          Analytics
        </a>
        <a href="#" className="hover:text-white">
          Signals
        </a>
      </div>

      <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
        Get Started
      </button>
    </nav>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-green-500 animate-pulse" />
        <div className="w-1 h-4 bg-green-500 animate-pulse [animation-delay:150ms]" />
        <div className="w-1 h-4 bg-green-500 animate-pulse [animation-delay:300ms]" />
      </div>
      <span className="text-green-500 text-xs tracking-widest opacity-60">
        LOADING
      </span>
    </div>
  );
}

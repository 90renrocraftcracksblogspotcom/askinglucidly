export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6">
      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          AskLucidity
        </h1>
        
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Ask anything..."
            className="w-full bg-zinc-900/50 border border-border rounded-2xl px-6 py-4 text-foreground text-lg focus:outline-none focus:border-accent transition-colors shadow-sm placeholder:text-zinc-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent text-zinc-950 rounded-xl hover:bg-emerald-400 transition-colors font-medium">
            Search
          </button>
        </div>
        
        <p className="text-sm text-zinc-500 font-mono">
          By Frostborn.tech
        </p>
      </main>
    </div>
  );
}

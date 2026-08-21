"use client";

import React, { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { saveMessage } from "@/lib/firebase";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string; citations?: any[] }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId] = useState(() => crypto.randomUUID()); // unique id per session

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text, citations: data.citations },
      ]);

      // Save to Firebase (fire and forget)
      saveMessage(chatId, userMsg, data.text).catch(console.error);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 items-center">
      {messages.length === 0 ? (
        <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-100">
            AskLucidity
          </h1>
          <form onSubmit={handleSubmit} className="w-full relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={loading}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-100 text-lg focus:outline-none focus:border-emerald-500 transition-colors shadow-sm placeholder:text-zinc-500 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors font-medium"
            >
              Search
            </button>
          </form>
          <p className="text-sm text-zinc-500 font-mono">By Frostborn.tech</p>
        </main>
      ) : (
        <div className="w-full max-w-3xl flex-1 flex flex-col p-6">
          <div className="flex-1 space-y-6 pb-24">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} citations={msg.citations} />
            ))}
            {loading && (
              <div className="flex justify-start my-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                  <span className="font-medium text-zinc-300">Searching...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent p-6 flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow up..."
                disabled={loading}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-100 text-[15px] focus:outline-none focus:border-emerald-500 transition-colors shadow-sm placeholder:text-zinc-500 disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

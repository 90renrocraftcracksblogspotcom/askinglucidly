import React from "react";
import ReactMarkdown from "react-markdown";

export const ChatMessage = ({ role, content, citations = [] }: { role: string, content: string, citations?: any[] }) => {
  if (role === "user") {
    return (
      <div className="flex justify-end my-4">
        <div className="bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-xl max-w-xl text-sm border border-zinc-700/40">
          {content}
        </div>
      </div>
    );
  }

  const renderWithCitations = (text: string) => {
    return text.split(/(\[\d+\])/g).map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        const sourceData = citations[citationNum - 1];
        return (
          <span
            key={index}
            className="inline-flex items-center justify-center font-mono text-[10px] px-1.5 py-0.5 rounded mx-0.5 align-super transition-all duration-150 bg-zinc-800 text-emerald-400 border border-zinc-700 hover:bg-emerald-950/40 cursor-pointer"
            title={sourceData?.url || `Source reference [${citationNum}]`}
            onClick={() => sourceData?.url && window.open(sourceData.url, "_blank")}
          >
            {citationNum}
          </span>
        );
      }
      return <span key={index} className="inline"><ReactMarkdown>{part}</ReactMarkdown></span>;
    });
  };

  return (
    <div className="flex flex-col gap-2 my-6 max-w-3xl">
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 select-none mb-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
        <span className="font-medium text-zinc-300">AskLucidity</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">Sonar by Perplexity</span>
      </div>
      <div className="text-zinc-200 font-sans text-[15px] leading-relaxed space-y-3 prose prose-invert max-w-none">
        {renderWithCitations(content)}
      </div>
    </div>
  );
};

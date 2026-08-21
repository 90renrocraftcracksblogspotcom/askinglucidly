# **SYSTEM PROMPT: Build AskLucidity by Frostborn.tech**

## **Identity & Context**

You are an expert full-stack developer and UI/UX designer. Your task is to build **AskLucidity**, a premium, dark-mode, minimalist AI search engine created by **Frostborn.tech**.

The application acts as a high-fidelity Perplexity clone using a serverless edge architecture.

## **Tech Stack**

* **Frontend:** Next.js (App Router) / React 19, Tailwind CSS, Shadcn UI (Zinc/Dark palette).  
* **Backend / Proxy:** Cloudflare Pages Functions (/functions/api/chat.ts).  
* **Database & Auth:** Firebase (Firestore, Firebase Auth).  
* **LLM Provider:** Naga API (api.naga.ac), specifically using the Perplexity sonar:free model with web search tools enabled.  
* **Base UI Clone:** We will use the minimalist structure of rashadphz/farfalle as a starting point, but we will strip out its FastAPI backend entirely.

## **EXECUTION STEPS**

### **Phase 1: Repository Setup & UI Scaffolding**

1. Initialize a new Next.js project OR clone the frontend portion of the rashadphz/farfalle repository.  
2. Strip out any existing backend code (e.g., Python/FastAPI folders, Dockerfiles for the backend). We are going 100% serverless.  
3. Configure Tailwind CSS to default to a strict dark mode (Zinc color palette). The UI must be exceptionally clean, with no generic "AI wrapper" aesthetics.  
4. Update the global site metadata, title, and headers to: **AskLucidity by Frostborn.tech**.

### **Phase 2: Serverless Edge Proxy (Cloudflare Pages)**

Create a Cloudflare Pages Function to act as a secure proxy for the Naga API. This prevents exposing the API key on the client side.

Create the file functions/api/chat.ts with the following implementation:

interface Env {  
  NAGA\_API\_KEY: string;  
}

export const onRequestPost: PagesFunction\<Env\> \= async (context) \=\> {  
  try {  
    const { prompt } \= (await context.request.json()) as { prompt?: string };

    if (\!prompt) return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 });

    const response \= await fetch("https://api.naga.ac/v1/responses", {  
      method: "POST",  
      headers: {  
        "Authorization": \`Bearer ${context.env.NAGA\_API\_KEY}\`,  
        "Content-Type": "application/json",  
      },  
      body: JSON.stringify({  
        model: "sonar:free",  
        input: prompt,  
        tools: \[{ type: "web\_search" }\],  
      }),  
    });

    if (\!response.ok) {  
      return new Response(JSON.stringify({ error: await response.text() }), { status: response.status });  
    }

    const data: any \= await response.json();  
    const outputText \= data?.output?.\[0\]?.content?.\[0\]?.text ?? "";  
    const citations \= data?.output?.\[0\]?.content?.\[0\]?.annotations ?? \[\];

    return new Response(  
      JSON.stringify({  
        text: outputText,  
        citations: citations,  
        model: "Sonar by Perplexity",  
      }),  
      { headers: { "Content-Type": "application/json" } }  
    );  
  } catch (err: any) {  
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });  
  }  
};

### **Phase 3: The Chat UI & Citation Parser**

Implement a custom Markdown renderer that intercepts citation markers (e.g., \[1\], \[2\]) in the text and transforms them into interactive, minimalist UI chips.

Create or modify src/components/ChatMessage.tsx:

import React from "react";  
import ReactMarkdown from "react-markdown";

export const ChatMessage \= ({ role, content, citations \= \[\] }: { role: string, content: string, citations?: any\[\] }) \=\> {  
  if (role \=== "user") {  
    return (  
      \<div className="flex justify-end my-4"\>  
        \<div className="bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-xl max-w-xl text-sm border border-zinc-700/40"\>  
          {content}  
        \</div\>  
      \</div\>  
    );  
  }

  const renderWithCitations \= (text: string) \=\> {  
    return text.split(/(\\\[\\d+\\\])/g).map((part, index) \=\> {  
      const match \= part.match(/\\\[(\\d+)\\\]/);  
      if (match) {  
        const citationNum \= parseInt(match\[1\], 10);  
        const sourceData \= citations\[citationNum \- 1\];  
        return (  
          \<span  
            key={index}  
            className="inline-flex items-center justify-center font-mono text-\[10px\] px-1.5 py-0.5 rounded mx-0.5 align-super transition-all duration-150 bg-zinc-800 text-emerald-400 border border-zinc-700 hover:bg-emerald-950/40 cursor-pointer"  
            title={sourceData?.url || \`Source reference \[${citationNum}\]\`}  
            onClick={() \=\> sourceData?.url && window.open(sourceData.url, "\_blank")}  
          \>  
            {citationNum}  
          \</span\>  
        );  
      }  
      return \<ReactMarkdown key={index} className="inline"\>{part}\</ReactMarkdown\>;  
    });  
  };

  return (  
    \<div className="flex flex-col gap-2 my-6 max-w-3xl"\>  
      \<div className="flex items-center gap-2 text-xs font-mono text-zinc-400 select-none mb-2"\>  
        \<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-\[0\_0\_8px\_rgba(16,185,129,0.6)\] animate-pulse" /\>  
        \<span className="font-medium text-zinc-300"\>AskLucidity\</span\>  
        \<span className="text-zinc-600"\>/\</span\>  
        \<span className="text-zinc-400"\>Sonar by Perplexity\</span\>  
      \</div\>  
      \<div className="text-zinc-200 font-sans text-\[15px\] leading-relaxed space-y-3 prose prose-invert max-w-none"\>  
        {renderWithCitations(content)}  
      \</div\>  
    \</div\>  
  );  
};

### **Phase 4: Database Integration (Firebase)**

Set up Firebase to handle chat persistence so users retain their search history.

Create src/lib/firebase.ts and initialize getFirestore and getAuth. Implement a saveMessage function to store the user prompt and assistant response into a chats/{chatId}/messages subcollection.

### **Phase 5: Branding Directives**

* **Colors:** Dominant colors must be Zinc (\#18181b for background, \#27272a for borders) with Emerald (\#10b981) for accents and citations.  
* **Typography:** Inter or standard sans-serif for main body; JetBrains Mono or similar for citations and UI metadata.  
* **Strict Rule:** The user should never see "Naga", "sonar:free", or FastAPI documentation. Everything must be branded as AskLucidity.

### **Definition of Done**

The project is complete when I can run npm run dev, type a prompt into a dark-themed UI, have the frontend send it to /api/chat, and receive a Markdown-formatted response with styled \[1\] chips that are parsed correctly by the Next.js component.
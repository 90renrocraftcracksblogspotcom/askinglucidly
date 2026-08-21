# AskLucidity

AskLucidity is an open-source, premium, dark-mode AI search engine. It serves as a high-fidelity Perplexity clone using a fully serverless edge architecture. 

**Referenced from:** [rashadphz/farfalle](https://github.com/rashadphz/farfalle)

## How It Works

AskLucidity relies on a 100% serverless frontend architecture (Next.js) coupled with Cloudflare Pages Functions as a secure proxy. 

### Naga.ac and Sonar
We use [Naga API (api.naga.ac)](https://naga.ac) as our backend LLM provider to power the search results. Specifically, we tap into the `sonar:free` (Sonar by Perplexity) model with web search tools enabled. 
By utilizing Naga API, we gain access to high-quality internet-connected LLM capabilities at a fraction of the cost, completely avoiding the need for a heavy Python/FastAPI backend. Our Cloudflare Pages Function (`/functions/api/chat.ts`) securely holds the `NAGA_API_KEY` and proxies the requests to Naga, ensuring keys are never exposed to the client.

## Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI
* **Edge Proxy:** Cloudflare Pages Functions
* **LLM Provider:** Naga API (`sonar:free` with web search)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up your environment variables based on `.env.example`. You will need a `NAGA_API_KEY`.
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Open Source
Contributions are welcome! Please feel free to submit a Pull Request.

# AskLucidity v1.0.0

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)
[![Naga API](https://img.shields.io/badge/LLM-Naga_API-blue)](https://naga.ac)

AskLucidity is an open-source, premium, dark-mode AI search engine. It serves as a high-fidelity Perplexity clone utilizing a fully serverless edge architecture. 

**Referenced heavily from:** [rashadphz/farfalle](https://github.com/rashadphz/farfalle)

## 🏗️ Architecture

AskLucidity relies on a **100% serverless frontend architecture (Next.js)** coupled with **Cloudflare Pages Functions** as a secure proxy. We stripped out the heavy FastAPI backend used in the original Farfalle repository to make this incredibly lightweight, fast, and completely free to host.

### Naga API & Sonar (Perplexity)
We use [Naga API (api.naga.ac)](https://naga.ac) as our backend LLM provider to power the search results. Specifically, we tap into the `sonar:free` (Sonar by Perplexity) model with web search tools enabled. 
By utilizing Naga API, we gain access to high-quality internet-connected LLM capabilities at a fraction of the cost, completely avoiding the need for a Python backend. Our Cloudflare Pages Function (`/functions/api/chat.ts`) securely holds the `NAGA_API_KEY` and proxies the requests to Naga, ensuring keys are never exposed to the client.

## 🚀 Detailed Build Guide

### Prerequisites
* Node.js (v18+)
* npm, yarn, or pnpm
* A Cloudflare account (for deployment)
* A [Naga API Key](https://naga.ac)

### 1. Local Setup & Installation

Clone the repository and install the required dependencies. We recommend using `--legacy-peer-deps` due to some React 18/19 peer dependency mismatches in the Farfalle UI components.

```bash
git clone https://github.com/90renrocraftcracksblogspotcom/askinglucidly.git
cd askinglucidly
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create a local environment file. 
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Naga API key:
```env
NAGA_API_KEY=your_naga_api_key_here
```

### 3. Running the Development Server

Start the Next.js development server:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000). The local development server will automatically intercept calls to `/api/chat` and route them through the Cloudflare Pages proxy logic defined in `/functions/api/chat.ts` (Next.js rewrites this automatically during `dev` based on our `next.config.mjs`, or you can rely on Wrangler if testing edge functions strictly).

### 4. Deploying to Cloudflare Pages

Because we are using Cloudflare Pages Functions (`/functions` folder) instead of Next.js `/api` routes, this project is designed to be deployed instantly on Cloudflare Pages.

1. Go to your Cloudflare Dashboard -> **Workers & Pages**.
2. Click **Create Application** -> **Pages** -> **Connect to Git**.
3. Select this repository.
4. **Build Settings:**
   * **Framework preset:** Next.js
   * **Build command:** `npm run build`
   * **Build output directory:** `.next` (or `out` if using static export)
5. **Environment Variables:**
   * Add `NAGA_API_KEY` to the Cloudflare Pages environment variables in the dashboard.
6. Click **Save and Deploy**.

## 🤝 Open Source
Contributions are welcome! If you want to add persistence, user auth, or streaming SSE back into the Cloudflare proxy, please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) License.

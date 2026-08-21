interface Env {
  NAGA_API_KEY: string;
}

type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { prompt } = (await context.request.json()) as { prompt?: string };

    if (!prompt) return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 });

    let attempt = 0;
    const maxAttempts = 3;
    let response: Response | null = null;
    let errorText = "";

    while (attempt < maxAttempts) {
      attempt++;
      
      response = await fetch("https://api.naga.ac/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${context.env.NAGA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar:free",
          input: prompt,
          tools: [{ type: "web_search" }],
        }),
      });

      if (!response.ok) {
        errorText = await response.text();
        console.log(`[AskLucidity] Attempt ${attempt} failed with status ${response.status}: ${errorText}`);
        
        try {
          const errData = JSON.parse(errorText);
          // Look for nested error string format provided by user
          const errorNested = typeof errData.error === 'string' ? JSON.parse(errData.error) : errData.error;
          const errMsg = errorNested?.error?.message || errorNested?.message || "";
          
          if (errMsg.includes("temporarily unavailable") || errMsg.includes("upstream provider")) {
            console.log(`[AskLucidity] Upstream provider unavailable (thinking...). Retrying...`);
            if (attempt < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
              continue;
            }
          }
        } catch (e) {
          // If JSON parse fails or other error, we don't retry by default
        }

        // If we didn't continue, return the error
        return new Response(JSON.stringify({ error: errorText }), { status: response.status });
      }

      // Successful response
      break;
    }

    if (!response || !response.ok) {
      return new Response(JSON.stringify({ error: errorText || "Request failed" }), { status: response?.status || 500 });
    }

    const data: any = await response.json();
    const outputText = data?.output?.[0]?.content?.[0]?.text ?? "";
    const citations = data?.output?.[0]?.content?.[0]?.annotations ?? [];

    return new Response(
      JSON.stringify({
        text: outputText,
        citations: citations,
        model: "Sonar by Perplexity",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[AskLucidity] Exception:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

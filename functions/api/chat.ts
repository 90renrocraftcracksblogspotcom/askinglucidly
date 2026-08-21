type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

interface Env {
  NAGA_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { prompt } = (await context.request.json()) as { prompt?: string };

    if (!prompt) return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 });

    const response = await fetch("https://api.naga.ac/v1/responses", {
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
      return new Response(JSON.stringify({ error: await response.text() }), { status: response.status });
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
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

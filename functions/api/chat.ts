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

    const response = await fetch("https://api.naga.ac/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.NAGA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: await response.text() }), { status: response.status });
    }

    const data: any = await response.json();
    const outputText = data?.choices?.[0]?.message?.content ?? "";
    // Perplexity/Naga citations are usually returned either at the root or within message
    const citations = data?.citations ?? data?.choices?.[0]?.message?.citations ?? [];

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

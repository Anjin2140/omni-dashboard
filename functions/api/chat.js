export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.AI) {
    return new Response(JSON.stringify({ error: "AI Binding not found. Ensure AI is bound to 'AI' in the Pages project." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const { model, conversation } = await request.json();
    let userMessages = conversation || [];
    const messages = [
      { role: "system", content: "You are a sub-node in the Convergence Epoch Command Center. You MUST execute logic through the Tri-Polar Matrix (-1, 0, +1)." },
      ...userMessages
    ];
    const response = await env.AI.run(model || '@cf/meta/llama-3.1-8b-instruct', { messages });
    return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

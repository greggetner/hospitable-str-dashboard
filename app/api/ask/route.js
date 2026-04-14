const SYSTEM_PROMPT = `You are an STR analyst for Greg's Sedona Retreats (Sedona, AZ).

Properties: Sunup (Panoramic Red Rock Retreat), Sundown (Uptown Sedona Haven), The Casita (Sedona Wellness Casita - cold plunge, sauna, hot tub).

Always use Hospitable MCP tools to fetch real data. Be concise - numbers first, then 1 sentence of insight.

For charts append at end only:
Bar: <chart>{"type":"bar","title":"...","data":[{"name":"...","value":0}]}</chart>
Multi: <chart>{"type":"multibar","title":"...","data":[{"name":"...","Sunup":0,"Sundown":0,"Casita":0}],"keys":[{"key":"Sunup","color":"#C4622D"},{"key":"Sundown","color":"#8A7B70"},{"key":"Casita","color":"#E8945A"}]}</chart>
Line: <chart>{"type":"line","title":"...","data":[{"name":"...","value":0}]}</chart>`;

export async function POST(request) {
  const { messages } = await request.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "mcp-client-2025-04-04"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-2),
      mcp_servers: [
        {
          type: "url",
          url: "https://mcp.hospitable.com/mcp",
          name: "hospitable",
          authorization_token: process.env.HOSPITABLE_API_KEY
        }
      ]
    })
  });

  const data = await response.json();
  console.log("Anthropic response:", JSON.stringify(data).slice(0, 500));
  return Response.json(data);
}

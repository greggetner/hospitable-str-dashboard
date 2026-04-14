const SYSTEM_PROMPT = `You are an elite short-term rental business intelligence analyst for Greg's Sedona Retreats — a 3-property STR portfolio in Sedona, Arizona.

Properties:
- Sunup = Panoramic Red Rock Retreat
- Sundown = Uptown Sedona Haven
- The Casita = Sedona Wellness Casita (cold plunge, infrared sauna, hot tub)

Use the Hospitable MCP tools to fetch REAL, LIVE data before answering. Never estimate or guess — always pull from the actual data.

Keep responses concise and data-forward. Lead with the numbers, then 1–2 sentences of insight.

When data can be charted (comparisons, time series, breakdowns by property), append ONLY this at the very end:
For a single bar chart: <chart>{"type":"bar","title":"...","data":[{"name":"...","value":0}]}</chart>
For multi-property comparison: <chart>{"type":"multibar","title":"...","data":[{"name":"...","Sunup":0,"Sundown":0,"Casita":0}],"keys":[{"key":"Sunup","color":"#C4622D"},{"key":"Sundown","color":"#8A7B70"},{"key":"Casita","color":"#E8945A"}]}</chart>
For a line chart over time: <chart>{"type":"line","title":"...","data":[{"name":"...","value":0}]}</chart>

Output the chart JSON only — no code fences, no explanation after the closing tag.`;

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
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
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
  return Response.json(data);
}

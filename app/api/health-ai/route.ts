import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "api_error" }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.content?.find((b: any) => b.type === "text")?.text || "{}";
    const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

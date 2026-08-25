import { NextRequest, NextResponse } from "next/server";

async function callGemini(prompt: string) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    let res: Response | null = null;
    let lastErr = "";
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      res = await callGemini(prompt);
      if (res.ok) break;

      lastErr = await res.text();
      const isOverloaded = res.status === 503 || res.status === 429;

      if (!isOverloaded || attempt === maxRetries) break;

      const waitMs = attempt * 1500;
      await new Promise((r) => setTimeout(r, waitMs));
    }

    if (!res || !res.ok) {
      console.error("Gemini API error:", lastErr);
      return NextResponse.json({ error: "api_error", detail: lastErr }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

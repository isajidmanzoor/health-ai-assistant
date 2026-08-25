import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const interactionSchema = {
  type: "OBJECT",
  properties: {
    safe: { type: "BOOLEAN" },
    interactions: { type: "ARRAY", items: { type: "STRING" } },
    warnings: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["safe", "interactions", "warnings"],
};

const analysisSchema = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    diseasePrediction: { type: "ARRAY", items: { type: "STRING" } },
    keyFindings: { type: "ARRAY", items: { type: "STRING" } },
    dietSuggestions: { type: "ARRAY", items: { type: "STRING" } },
    lifestyleTips: { type: "ARRAY", items: { type: "STRING" } },
    doctorQuestions: { type: "ARRAY", items: { type: "STRING" } },
    urgency: { type: "STRING", enum: ["low", "medium", "high"] },
    disclaimer: { type: "STRING" },
  },
  required: [
    "summary",
    "diseasePrediction",
    "keyFindings",
    "dietSuggestions",
    "lifestyleTips",
    "doctorQuestions",
    "urgency",
    "disclaimer",
  ],
};

function buildPrompt(prompt: string) {
  return prompt.trim();
}

function extractText(data: unknown) {
  const candidate = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })?.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) {
    throw new Error("empty_model_response");
  }
  return text;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "missing_api_key", detail: "GEMINI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { prompt?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const prompt = typeof body?.prompt === "string" ? buildPrompt(body.prompt) : "";
  if (!prompt) {
    return NextResponse.json(
      { error: "missing_prompt", detail: "Request body must include a non-empty prompt string." },
      { status: 400 }
    );
  }

  const analysisRequest = prompt.includes("pharmacology expert")
    ? {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: interactionSchema,
          temperature: 0.2,
        },
      }
    : {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
          temperature: 0.2,
        },
      };

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(analysisRequest),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "api_error", detail: errText },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = extractText(data);
    const result = JSON.parse(text);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "server_error", detail: err instanceof Error ? err.message : "unknown_error" },
      { status: 500 }
    );
  }
}

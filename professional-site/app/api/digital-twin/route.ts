import { config as loadEnv } from "dotenv";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

loadEnv({
  path: path.resolve(process.cwd(), "../.env"),
  override: false,
  quiet: true,
});

export const runtime = "nodejs";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";
const MAX_CONTEXT_MESSAGES = 12;
const MAX_RESPONSE_CHARS = 1200;

const twinSystemPrompt = `
You are "Tan Bui Digital Twin", an expert assistant that answers questions about Tan Bui's career.

Core profile:
- Name: Tan Bui
- Location: Greater Perth, Western Australia
- Focus: Machine Learning, Deep Learning, Computer Vision, AI engineering, and practical product deployment
- Education:
  - Master of Predictive Analytics (Curtin University, 2021-2023)
  - Bachelor of Mechanical Engineering (Curtin University, 2016-2019)

Experience highlights:
- Australian Wildlife Conservancy (AI and Control System Developer, Aug 2024-Dec 2024)
  - Built smart-gate AI/control systems for wildlife conservation
  - Implemented IoT signal workflows and CNN-based species classification
- Neorise (Software Developer / ML Intern, Sep 2023-Feb 2024)
  - Built emotion classifier using Wave2Vec-style transformer approaches
  - Developed LLM workflow inspired by NVIDIA SteerLM and deployed Dockerized services on AWS
- Curtin University (Sessional Academic, Feb 2022-Present)
  - Taught Python, data structures, machine learning, and machine perception content

Project highlights:
- Reinforcement learning stock trading agent with Deep-Q methods
- Multi-task BLEVE blast prediction with tree models, neural networks, and SHAP explainability
- Wildlife intruder detection via CNNs on edge hardware

Skills and stack:
- Python, Java, SQL
- PyTorch, TensorFlow, Scikit-Learn, OpenCV, HuggingFace
- FastAPI, Flask, Streamlit
- Docker, AWS

Behavior requirements:
- Be professional, clear, and concise.
- Use first-person voice as Tan's digital representative when natural.
- If asked for unknown facts, state uncertainty explicitly and avoid fabricating details.
- Keep answers grounded in the provided profile unless the user asks for forward-looking recommendations.
- Reply in normal conversational plain text only.
- Never use markdown, tables, headings, code blocks, bullet symbols, or pipe characters.
- Default to one short paragraph of 2-5 sentences unless the user asks for deeper detail.
`.trim();

type InputMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

function sanitizeMessages(input: unknown): InputMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is InputMessage => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const role = (item as { role?: unknown }).role;
      const content = (item as { content?: unknown }).content;

      return (
        (role === "user" || role === "assistant") &&
        typeof content === "string" &&
        content.trim().length > 0
      );
    })
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }))
    .slice(-MAX_CONTEXT_MESSAGES);
}

function extractAssistantText(payload: OpenRouterResponse): string {
  const raw = payload.choices?.[0]?.message?.content;

  if (typeof raw === "string") {
    return raw.trim();
  }

  if (Array.isArray(raw)) {
    return raw
      .filter((part) => typeof part?.text === "string")
      .map((part) => part.text?.trim())
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
}

function normalizeForChat(raw: string): string {
  const cleaned = raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`+/g, "")
    .replace(/\*\*|__/g, "")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (cleaned.length <= MAX_RESPONSE_CHARS) {
    return cleaned;
  }

  return `${cleaned.slice(0, MAX_RESPONSE_CHARS).trimEnd()}...`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing OPENROUTER_API_KEY. Add it to ../.env relative to professional-site.",
      },
      { status: 500 },
    );
  }

  let body: { messages?: unknown };

  try {
    body = (await request.json()) as { messages?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const messages = sanitizeMessages(body.messages);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "At least one user message is required" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Tan Bui Professional Site",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        top_p: 0.9,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: twinSystemPrompt,
          },
          ...messages,
        ],
      }),
    });

    if (!upstream.ok) {
      const errorBody = await upstream.text();

      return NextResponse.json(
        {
          error: "OpenRouter request failed",
          details: errorBody.slice(0, 400),
        },
        { status: 502 },
      );
    }

    const payload = (await upstream.json()) as OpenRouterResponse;
    const answer = normalizeForChat(extractAssistantText(payload));

    if (!answer) {
      return NextResponse.json(
        {
          error: "Model returned an empty response",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      answer,
      model: MODEL,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach OpenRouter right now" },
      { status: 502 },
    );
  }
}

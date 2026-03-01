"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const starterPrompts = [
  "What is Tan's strongest technical skill set?",
  "Tell me about Tan's career journey in 60 seconds.",
  "How has Tan applied AI in real-world projects?",
  "What kinds of roles is Tan best suited for?",
];

export function DigitalTwinChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Tan's Digital Twin. Ask me anything about Tan's background, projects, and career direction.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }

    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages, isLoading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  async function sendMessage(rawPrompt?: string) {
    const content = (rawPrompt ?? input).trim();

    if (!content || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Chat request failed");
      }

      const payload = (await response.json()) as { answer?: string };
      const answer = payload.answer?.trim();

      if (!answer) {
        throw new Error("The model returned an empty response");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unexpected chat error";

      setError(message);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I hit a connection issue while reaching OpenRouter. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <div className="rounded-3xl border border-cyan-300/30 bg-slate-950/70 p-5 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur md:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-200">Digital Twin Chat</p>
          <p className="mt-1 text-xs text-slate-400">
            Powered by OpenRouter · Model: openai/gpt-oss-120b
          </p>
        </div>
      </div>

      <div ref={viewportRef} className="h-[360px] space-y-3 overflow-y-auto rounded-2xl border border-white/12 bg-black/20 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "assistant"
                ? "bg-cyan-400/10 text-slate-100"
                : "ml-auto border border-cyan-300/25 bg-slate-800/80 text-cyan-100"
            }`}
          >
            {message.content}
          </div>
        ))}

        {isLoading ? (
          <div className="max-w-[90%] rounded-2xl bg-cyan-400/10 px-4 py-3 text-sm text-slate-200">
            Thinking...
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-xs text-rose-300">Connection note: {error}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            disabled={isLoading}
            className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Tan's projects, skills, or experience..."
          className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-xl border border-cyan-200/30 bg-cyan-400/20 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}

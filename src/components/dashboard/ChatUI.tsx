"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  author: string;
  initials: string;
  text?: string;
  imageUrl?: string;
  timeLabel: string;
  isOwn: boolean;
};

const SEED_MESSAGES: Message[] = [
  {
    id: "1",
    author: "Marcus Reynolds",
    initials: "MR",
    text: "NVDA looking strong above $138 — watching for a break of $140 for continuation. Call spread still in play.",
    timeLabel: "45m ago",
    isOwn: false,
  },
  {
    id: "2",
    author: "Priya Sharma",
    initials: "PS",
    text: "SPY put spread closed +205%. CPI data was the catalyst. Pre-market brief going out in 10 mins.",
    timeLabel: "30m ago",
    isOwn: false,
  },
  {
    id: "3",
    author: "Jordan Kane",
    initials: "JK",
    text: "TSLA 250C still open — up 68% unrealised. Delivery event next week is the key catalyst. Hold.",
    timeLabel: "12m ago",
    isOwn: false,
  },
];

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendText(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "You",
        initials: "ME",
        text: text.trim(),
        timeLabel: "just now",
        isOwn: true,
      },
    ]);
    setText("");
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "You",
        initials: "ME",
        imageUrl: url,
        timeLabel: "just now",
        isOwn: true,
      },
    ]);
    e.target.value = "";
  }

  return (
    <div
      className="flex flex-col h-full rounded-sm overflow-hidden"
      style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(8,13,26,0.8)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 shrink-0"
        style={{ borderBottom: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.03)" }}
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full" style={{ background: "#C9A96E", animation: "pulse 2s infinite" }} />
          <span className="text-xs font-medium" style={{ color: "#E8D5A3" }}>Premium Community</span>
        </div>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>
          {messages.length} messages
        </span>
      </div>

      {/* Notice */}
      <div
        className="px-5 py-2.5 text-[10px] text-center shrink-0"
        style={{ background: "rgba(201,169,110,0.04)", borderBottom: "1px solid rgba(201,169,110,0.07)", color: "rgba(240,234,216,0.35)" }}
      >
        Real-time sync requires Supabase — messages below are local preview only
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.isOwn ? "flex-row-reverse" : ""}`}>
            {!m.isOwn && (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[11px] font-semibold"
                style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
              >
                {m.initials}
              </div>
            )}
            <div className={`flex flex-col gap-1 max-w-[75%] ${m.isOwn ? "items-end" : "items-start"}`}>
              {!m.isOwn && (
                <span className="text-[10px] font-medium" style={{ color: "rgba(201,169,110,0.7)" }}>{m.author}</span>
              )}
              {m.text && (
                <div
                  className="px-4 py-2.5 rounded-sm text-sm leading-relaxed"
                  style={{
                    background: m.isOwn ? "rgba(201,169,110,0.12)" : "rgba(240,234,216,0.05)",
                    border: `1px solid ${m.isOwn ? "rgba(201,169,110,0.25)" : "rgba(240,234,216,0.08)"}`,
                    color: "rgba(240,234,216,0.8)",
                    fontWeight: 300,
                  }}
                >
                  {m.text}
                </div>
              )}
              {m.imageUrl && (
                <img
                  src={m.imageUrl}
                  alt="shared"
                  className="max-w-xs rounded-sm object-cover"
                  style={{ border: "1px solid rgba(201,169,110,0.2)", maxHeight: "200px" }}
                />
              )}
              <span className="text-[10px]" style={{ color: "rgba(240,234,216,0.25)" }}>
                {m.timeLabel}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendText}
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}
      >
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 flex h-9 w-9 items-center justify-center rounded-sm transition-all duration-200"
          style={{ border: "1px solid rgba(201,169,110,0.2)", color: "rgba(201,169,110,0.5)" }}
          title="Share image"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message the community…"
          className="flex-1 rounded-sm px-4 py-2.5 text-sm outline-none"
          style={{
            background: "rgba(201,169,110,0.04)",
            border: "1px solid rgba(201,169,110,0.15)",
            color: "#E8D5A3",
          }}
        />
        <button
          type="submit"
          className="shrink-0 px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

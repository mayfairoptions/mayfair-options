"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  user_id: string;
  author: string;
  initials: string;
  text: string | null;
  image_url: string | null;
  created_at: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ChatUI() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load existing messages
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    // Subscribe to new messages in real time
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const authorName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "Member"
    : "Member";
  const authorInitials = getInitials(authorName);

  async function sendText(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !user) return;
    const msg = text.trim();
    setText("");
    await supabase.from("messages").insert({
      user_id: user.id,
      author: authorName,
      initials: authorInitials,
      text: msg,
      image_url: null,
    });
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    e.target.value = "";
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `chat/${user.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      await supabase.from("messages").insert({
        user_id: user.id,
        author: authorName,
        initials: authorInitials,
        text: null,
        image_url: urlData.publicUrl,
      });
    }
    setUploading(false);
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
          <span className="text-xs font-medium" style={{ color: "#E8D5A3" }}>Live Community Chat</span>
        </div>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>
          {messages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {messages.length === 0 && (
          <p className="text-center text-xs mt-10" style={{ color: "rgba(240,234,216,0.2)" }}>
            No messages yet. Be the first to say something.
          </p>
        )}
        {messages.map((m) => {
          const isOwn = m.user_id === user?.id;
          return (
            <div key={m.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
              {!isOwn && (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[11px] font-semibold"
                  style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
                >
                  {m.initials}
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                {!isOwn && (
                  <span className="text-[10px] font-medium" style={{ color: "rgba(201,169,110,0.7)" }}>{m.author}</span>
                )}
                {m.text && (
                  <div
                    className="px-4 py-2.5 rounded-sm text-sm leading-relaxed"
                    style={{
                      background: isOwn ? "rgba(201,169,110,0.12)" : "rgba(240,234,216,0.05)",
                      border: `1px solid ${isOwn ? "rgba(201,169,110,0.25)" : "rgba(240,234,216,0.08)"}`,
                      color: "rgba(240,234,216,0.8)",
                      fontWeight: 300,
                    }}
                  >
                    {m.text}
                  </div>
                )}
                {m.image_url && (
                  <img
                    src={m.image_url}
                    alt="shared"
                    className="max-w-xs rounded-sm object-cover"
                    style={{ border: "1px solid rgba(201,169,110,0.2)", maxHeight: "200px" }}
                  />
                )}
                <span className="text-[10px]" style={{ color: "rgba(240,234,216,0.25)" }}>
                  {timeAgo(m.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendText}
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex h-9 w-9 items-center justify-center rounded-sm transition-all duration-200"
          style={{ border: "1px solid rgba(201,169,110,0.2)", color: uploading ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.5)" }}
          title="Share image"
        >
          {uploading ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? "Message the community…" : "Sign in to chat"}
          disabled={!user}
          className="flex-1 rounded-sm px-4 py-2.5 text-sm outline-none"
          style={{
            background: "rgba(201,169,110,0.04)",
            border: "1px solid rgba(201,169,110,0.15)",
            color: "#E8D5A3",
          }}
        />
        <button
          type="submit"
          disabled={!user || !text.trim()}
          className="shrink-0 px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-200 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

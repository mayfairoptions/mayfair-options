"use client";

import { useState, useRef, useCallback } from "react";

type GalleryItem = {
  id: string;
  url: string;
  tag: "win" | "loss";
  uploadedAt: Date;
};

export default function GalleryUpload() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pendingTag, setPendingTag] = useState<"win" | "loss" | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPendingUrl(url);
    setPendingTag("win");
  }, []);

  function confirmUpload() {
    if (!pendingUrl || !pendingTag) return;
    setItems(prev => [
      {
        id: Date.now().toString(),
        url: pendingUrl,
        tag: pendingTag,
        uploadedAt: new Date(),
      },
      ...prev,
    ]);
    setPendingUrl(null);
    setPendingTag(null);
  }

  function cancelUpload() {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPendingUrl(null);
    setPendingTag(null);
  }

  const wins = items.filter(i => i.tag === "win").length;
  const losses = items.filter(i => i.tag === "loss").length;

  return (
    <div className="flex flex-col gap-6">

      {/* Stats bar */}
      {items.length > 0 && (
        <div className="flex gap-4">
          {[
            { label: "Wins", val: wins, color: "#C9A96E" },
            { label: "Losses", val: losses, color: "#ef4444" },
            { label: "Total", val: items.length, color: "rgba(240,234,216,0.6)" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-sm px-5 py-3"
              style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(201,169,110,0.03)" }}
            >
              <span className="text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)", color: s.color }}>{s.val}</span>
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.35)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {!pendingUrl ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className="flex flex-col items-center justify-center gap-4 rounded-sm cursor-pointer transition-all duration-300 py-16"
          style={{
            border: `1px dashed ${dragging ? "rgba(201,169,110,0.6)" : "rgba(201,169,110,0.2)"}`,
            background: dragging ? "rgba(201,169,110,0.06)" : "rgba(201,169,110,0.02)",
          }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-sm"
            style={{ border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#E8D5A3" }}>Drop screenshot here</p>
            <p className="text-xs mt-1" style={{ color: "rgba(240,234,216,0.35)" }}>or click to browse · Images only</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
      ) : (
        /* Tag selection */
        <div
          className="rounded-sm p-6"
          style={{ border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
        >
          <p className="mb-4 text-xs tracking-widest uppercase text-center" style={{ color: "rgba(201,169,110,0.6)" }}>
            Tag this trade
          </p>
          <div className="flex gap-4 mb-5 justify-center">
            <img src={pendingUrl} alt="preview" className="max-h-48 rounded-sm object-contain" style={{ border: "1px solid rgba(201,169,110,0.15)" }} />
          </div>
          <div className="flex gap-3 justify-center mb-5">
            {(["win", "loss"] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setPendingTag(tag)}
                className="px-8 py-2.5 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-200"
                style={{
                  border: `1px solid ${pendingTag === tag ? (tag === "win" ? "#C9A96E" : "#ef4444") : "rgba(240,234,216,0.15)"}`,
                  background: pendingTag === tag ? (tag === "win" ? "rgba(201,169,110,0.15)" : "rgba(239,68,68,0.15)") : "transparent",
                  color: pendingTag === tag ? (tag === "win" ? "#C9A96E" : "#ef4444") : "rgba(240,234,216,0.4)",
                }}
              >
                {tag === "win" ? "✓ Win" : "✗ Loss"}
              </button>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={cancelUpload}
              className="px-6 py-2 text-xs tracking-widest uppercase rounded-sm"
              style={{ border: "1px solid rgba(240,234,216,0.1)", color: "rgba(240,234,216,0.4)" }}
            >
              Cancel
            </button>
            <button
              onClick={confirmUpload}
              className="px-6 py-2 text-xs tracking-widest uppercase rounded-sm font-medium"
              style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
            >
              Add to Gallery
            </button>
          </div>
        </div>
      )}

      {/* Gallery grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-sm"
              style={{ border: `1px solid ${item.tag === "win" ? "rgba(201,169,110,0.25)" : "rgba(239,68,68,0.25)"}` }}
            >
              <img
                src={item.url}
                alt={item.tag}
                className="w-full object-cover"
                style={{ maxHeight: "160px" }}
              />
              <div
                className="absolute top-2 left-2 px-2 py-0.5 text-[9px] tracking-widest uppercase font-semibold rounded-sm"
                style={{
                  background: item.tag === "win" ? "rgba(201,169,110,0.9)" : "rgba(239,68,68,0.9)",
                  color: item.tag === "win" ? "#03060f" : "#fff",
                }}
              >
                {item.tag}
              </div>
              <button
                onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded-sm"
                style={{ background: "rgba(0,0,0,0.7)", color: "rgba(240,234,216,0.7)" }}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !pendingUrl && (
        <p className="text-center text-xs" style={{ color: "rgba(240,234,216,0.25)" }}>
          No screenshots yet — upload your first trade above
        </p>
      )}

      <p className="text-center text-[10px]" style={{ color: "rgba(240,234,216,0.2)" }}>
        Persistent storage requires Supabase — uploads are local preview only until connected
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type GalleryItem = {
  id: string;
  user_id: string;
  author: string;
  initials: string;
  image_url: string;
  tag: "win" | "loss";
  created_at: string;
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function GalleryUpload() {
  const { user } = useUser();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [pendingTag, setPendingTag] = useState<"win" | "loss" | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as GalleryItem[]);
      });
  }, []);

  const authorName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "Member"
    : "Member";

  function pickFile(file: File) {
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setPendingTag(null);
  }

  async function confirmUpload() {
    if (!pendingFile || !pendingTag || !user) return;
    setUploading(true);
    setUploadError(null);
    const ext = pendingFile.name.split(".").pop();
    const path = `gallery/${user.id}-${Date.now()}.${ext}`;
    const { error: storageError } = await supabase.storage.from("uploads").upload(path, pendingFile, { upsert: true });
    if (storageError) {
      setUploadError(`Storage error: ${storageError.message}`);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    const { data: inserted, error: dbError } = await supabase
      .from("gallery_items")
      .insert({
        user_id: user.id,
        author: authorName,
        initials: getInitials(authorName),
        image_url: urlData.publicUrl,
        tag: pendingTag,
      })
      .select()
      .single();
    if (dbError) {
      setUploadError(`Database error: ${dbError.message}`);
    } else if (inserted) {
      setItems((prev) => [inserted as GalleryItem, ...prev]);
      setPendingFile(null);
      setPendingPreview(null);
      setPendingTag(null);
    }
    setUploading(false);
  }

  async function deleteItem(item: GalleryItem) {
    if (item.user_id !== user?.id) return;
    const storagePath = item.image_url.split("/uploads/")[1];
    await supabase.storage.from("uploads").remove([storagePath]);
    await supabase.from("gallery_items").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  const wins = items.filter((i) => i.tag === "win").length;
  const losses = items.filter((i) => i.tag === "loss").length;

  return (
    <div className="flex flex-col gap-8">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: items.length, color: "rgba(240,234,216,0.6)" },
          { label: "Wins", value: wins, color: "#4ade80" },
          { label: "Losses", value: losses, color: "#f87171" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-4 rounded-sm"
            style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.02)" }}
          >
            <span className="text-2xl font-light" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "rgba(240,234,216,0.3)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      {!pendingPreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f?.type.startsWith("image/")) pickFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 py-12 rounded-sm cursor-pointer transition-all duration-300"
          style={{
            border: `2px dashed ${dragging ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0.15)"}`,
            background: dragging ? "rgba(201,169,110,0.04)" : "transparent",
          }}
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: "rgba(201,169,110,0.3)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm" style={{ color: "rgba(240,234,216,0.35)", fontWeight: 300 }}>
            Drop a screenshot here or <span style={{ color: "#C9A96E" }}>browse</span>
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); e.target.value = ""; }}
          />
        </div>
      ) : (
        /* Tag selection */
        <div
          className="flex flex-col gap-5 p-5 rounded-sm"
          style={{ border: "1px solid rgba(201,169,110,0.15)", background: "rgba(201,169,110,0.02)" }}
        >
          <img src={pendingPreview} alt="preview" className="w-full max-h-48 object-contain rounded-sm" />
          <p className="text-xs text-center" style={{ color: "rgba(240,234,216,0.4)" }}>Tag this trade</p>
          <div className="flex gap-3">
            {(["win", "loss"] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setPendingTag(tag)}
                className="flex-1 py-2.5 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-200"
                style={{
                  background: pendingTag === tag
                    ? tag === "win" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)"
                    : "transparent",
                  border: `1px solid ${pendingTag === tag
                    ? tag === "win" ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"
                    : "rgba(240,234,216,0.1)"}`,
                  color: pendingTag === tag
                    ? tag === "win" ? "#4ade80" : "#f87171"
                    : "rgba(240,234,216,0.3)",
                }}
              >
                {tag === "win" ? "✓ Win" : "✗ Loss"}
              </button>
            ))}
          </div>
          {uploadError && (
            <p className="text-xs text-center" style={{ color: "#f87171" }}>{uploadError}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => { setPendingFile(null); setPendingPreview(null); setPendingTag(null); setUploadError(null); }}
              className="flex-1 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
              style={{ border: "1px solid rgba(240,234,216,0.1)", color: "rgba(240,234,216,0.3)" }}
            >
              Cancel
            </button>
            <button
              onClick={confirmUpload}
              disabled={!pendingTag || uploading || !user}
              className="flex-1 py-2.5 rounded-sm text-xs tracking-widest uppercase font-medium transition-all duration-200 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
            >
              {uploading ? "Uploading…" : "Add to Gallery"}
            </button>
          </div>
        </div>
      )}

      {/* Gallery grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-sm overflow-hidden" style={{ border: "1px solid rgba(201,169,110,0.1)" }}>
              <img src={item.image_url} alt={item.tag} className="w-full h-40 object-cover" />
              <span
                className="absolute top-2 left-2 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm font-semibold"
                style={{
                  background: item.tag === "win" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)",
                  border: `1px solid ${item.tag === "win" ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
                  color: item.tag === "win" ? "#4ade80" : "#f87171",
                }}
              >
                {item.tag}
              </span>
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5" style={{ background: "rgba(3,6,15,0.7)" }}>
                <span className="text-[10px]" style={{ color: "rgba(240,234,216,0.5)" }}>{item.author}</span>
              </div>
              {item.user_id === user?.id && (
                <button
                  onClick={() => deleteItem(item)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(3,6,15,0.8)", border: "1px solid rgba(240,234,216,0.15)", color: "rgba(240,234,216,0.5)" }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        !pendingPreview && (
          <p className="text-center text-xs" style={{ color: "rgba(240,234,216,0.2)" }}>
            No screenshots yet — upload your first trade above
          </p>
        )
      )}
    </div>
  );
}

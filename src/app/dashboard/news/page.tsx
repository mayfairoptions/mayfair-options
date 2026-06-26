import NewsFeed from "@/components/dashboard/NewsFeed";

export default function NewsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Markets</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          News & <span className="italic text-gold-gradient">Catalysts</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Market-moving headlines and upcoming catalysts. Know the story behind every move.
        </p>
      </div>
      <NewsFeed />
    </div>
  );
}

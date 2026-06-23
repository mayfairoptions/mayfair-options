import GalleryUpload from "@/components/dashboard/GalleryUpload";

export default async function GalleryPage() {

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Premium</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Win / Loss <span className="italic text-gold-gradient">Gallery</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Upload trade screenshots. Tag them as wins or losses. Build your track record.
        </p>
      </div>
      <GalleryUpload />
    </div>
  );
}

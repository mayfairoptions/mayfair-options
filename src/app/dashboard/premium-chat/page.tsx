import ChatUI from "@/components/dashboard/ChatUI";

export default function PremiumChatPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 gap-6">
      <div>
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Premium</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Premium <span className="italic text-gold-gradient">Chat</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Private channel for Premium members and analysts. Higher signal, lower noise.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatUI table="premium_messages" />
      </div>
    </div>
  );
}

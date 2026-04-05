import { AshokChakra } from "./AshokChakra";

export function Navbar() {
  return (
    <nav className="h-16 bg-navy flex items-center justify-between px-6 border-b border-navy-light fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <img src="/src/assets/new_logo.png" alt="GIA Shield Logo" className="h-10 w-auto object-contain" />
        <div className="flex flex-col">
          <span className="text-[#C8922A] text-xl font-black tracking-tighter uppercase leading-tight drop-shadow-sm">GIA Shield</span>
          <span className="text-[10px] text-white/40 uppercase font-bold leading-tight tracking-widest">
            Government Integrated Audit Unit
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-primary-foreground/60 text-sm hidden md:block">Karnataka e-Governance</span>
        <div className="w-6 h-6 rounded-full bg-primary-foreground/10 flex items-center justify-center">
          <AshokChakra size={16} className="text-primary-foreground/40" />
        </div>
        <div className="border border-primary-foreground/20 rounded-full px-3 py-1">
          <span className="text-primary-foreground/80 text-xs font-medium">Officer ID: KA-2024-0731</span>
        </div>
      </div>
    </nav>
  );
}

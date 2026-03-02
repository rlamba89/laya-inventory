"use client";

export function Footer() {
  return (
    <footer className="no-print border-t border-sand bg-ivory px-6 py-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-stone">
          T &nbsp; R &nbsp; K
        </span>
        <span className="text-[10px] tracking-wider text-stone">
          The Pursuit of Smarter Living
        </span>
        <span className="text-[10px] text-stone/70">
          Level 13, 145 Eagle Street, Brisbane QLD 4000
        </span>
      </div>
    </footer>
  );
}

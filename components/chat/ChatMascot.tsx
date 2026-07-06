"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** How far the pupils can drift inside each eye, in SVG user units. */
const EYE_TRACK_RADIUS = 3.2;

/** Gap between pop-out greetings; the sequence itself runs POP_MS. */
const POP_INTERVAL_MS = 12000;
const POP_MS = 2800;

interface ChatMascotProps {
  onClick: () => void;
}

/**
 * Waving robot mascot used as the closed-state chat toggle on the public
 * homepage — original artwork (not the reference image, which is
 * unlicensed). Eyes track the cursor anywhere on the page; the hand waves
 * on a long loop, and every few seconds the whole robot pops up out of the
 * launcher for a big "hi!" wave so passers-by actually notice it.
 */
export function ChatMascot({ onClick }: ChatMascotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [showBubble, setShowBubble] = useState(true);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let settle: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setPopping(true);
      settle = setTimeout(() => setPopping(false), POP_MS);
    }, POP_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(settle);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.hypot(dx, dy) / 12, EYE_TRACK_RADIUS);
        setPupil({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div
        className={cn(
          "pointer-events-none absolute right-0 w-52 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink shadow-lg transition-all duration-300",
          popping ? "bottom-[118px]" : "bottom-[88px]",
          showBubble || popping
            ? "rts-bubble-in opacity-100"
            : "opacity-0 group-hover:opacity-100"
        )}
      >
        {popping
          ? "Hi there! 👋 Got a question? I'm right here!"
          : "Hi, I'm Raj — ask me about RTS courses, fees, or admissions!"}
      </div>

      <button
        type="button"
        onClick={onClick}
        aria-label="Chat with Raj"
        className="relative h-16 w-16 rounded-full border border-line bg-surface shadow-lg transition-transform duration-300 hover:scale-110"
      >
        {/* attention ring that ripples outward while the robot pops out */}
        {popping && (
          <span className="rts-pop-ring pointer-events-none absolute inset-0 rounded-full" />
        )}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="h-full w-full overflow-visible"
        >
          {/* Whole robot pops up out of the launcher during the periodic
              greeting; overflow-visible on the svg lets it rise past the
              circle so it reads as climbing out of the box. */}
          <g
            className={cn(popping && "rts-pop")}
            style={{ transformOrigin: "50px 100px" }}
          >
          {/* antenna */}
          <line x1="50" y1="9" x2="50" y2="18" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="7" r="4" fill="var(--primary)" />

          {/* head */}
          <rect x="20" y="18" width="60" height="50" rx="20" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2.5" />
          {/* ears */}
          <rect x="11" y="34" width="9" height="16" rx="4" fill="var(--muted)" stroke="var(--ink)" strokeWidth="2" />
          <rect x="80" y="34" width="9" height="16" rx="4" fill="var(--muted)" stroke="var(--ink)" strokeWidth="2" />

          {/* Eyes track the cursor. Colors are fixed (not var(--ink)) on
              purpose: the sclera is always white, so a theme-linked pupil
              color would wash out to near-invisible in dark mode where
              --ink is a light color. */}
          <circle cx="38" cy="42" r="8" fill="#ffffff" stroke="#1c2b3a" strokeWidth="1.5" />
          <circle cx="62" cy="42" r="8" fill="#ffffff" stroke="#1c2b3a" strokeWidth="1.5" />
          <circle cx={38 + pupil.x} cy={42 + pupil.y} r="3.6" fill="#1c2b3a" />
          <circle cx={62 + pupil.x} cy={42 + pupil.y} r="3.6" fill="#1c2b3a" />

          {/* smile */}
          <path d="M 40 56 Q 50 63 60 56" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />

          {/* body */}
          <rect x="28" y="70" width="44" height="24" rx="10" fill="var(--primary)" />

          {/* waving arm — pivots at the shoulder; idles on a "wave twice,
              pause" loop and switches to big enthusiastic sweeps while the
              robot is popped out */}
          <g
            className={popping ? "rts-wave-big" : "rts-wave"}
            style={{ transformOrigin: "70px 78px" }}
          >
            <rect x="66" y="58" width="8" height="22" rx="4" fill="var(--primary)" />
            <circle cx="70" cy="56" r="6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
          </g>
          </g>
        </svg>
      </button>
    </div>
  );
}

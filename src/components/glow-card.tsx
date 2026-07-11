import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showTechBrackets?: boolean;
}

export function GlowCard({
  children,
  className,
  showTechBrackets = true,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] backdrop-blur p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.08)]",
        className
      )}
      {...props}
    >
      {/* Spotlight Background Glow (Emerald) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.08), transparent 45%)`,
        }}
      />
      
      {/* Spotlight Border Glow (Indigo) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-10"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.35), transparent 50%)`,
          padding: "1.5px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Tech brackets for cybernetic aesthetic */}
      {showTechBrackets && (
        <>
          <div className="tech-bracket-tl transition-all duration-300 opacity-25 group-hover/card:opacity-75 group-hover/card:scale-105 z-20" />
          <div className="tech-bracket-tr transition-all duration-300 opacity-25 group-hover/card:opacity-75 group-hover/card:scale-105 z-20" />
          <div className="tech-bracket-bl transition-all duration-300 opacity-25 group-hover/card:opacity-75 group-hover/card:scale-105 z-20" />
          <div className="tech-bracket-br transition-all duration-300 opacity-25 group-hover/card:opacity-75 group-hover/card:scale-105 z-20" />
        </>
      )}

      {/* Content wrapper to stay on top of background spotlight */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

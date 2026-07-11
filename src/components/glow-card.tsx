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
        "group/card relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-x-[3px] hover:-translate-y-[3px] shadow-[2px_2px_0px_var(--border)] hover:shadow-[6px_6px_0px_var(--border)]",
        className
      )}
      {...props}
    >
      {/* Subtle border line accent */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-10"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.20), transparent 60%)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Tech brackets for cybernetic alignment crosshairs */}
      {showTechBrackets && (
        <>
          <div className="tech-bracket-tl transition-all duration-300 opacity-30 group-hover/card:opacity-95 z-20" />
          <div className="tech-bracket-tr transition-all duration-300 opacity-30 group-hover/card:opacity-95 z-20" />
          <div className="tech-bracket-bl transition-all duration-300 opacity-30 group-hover/card:opacity-95 z-20" />
          <div className="tech-bracket-br transition-all duration-300 opacity-30 group-hover/card:opacity-95 z-20" />
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

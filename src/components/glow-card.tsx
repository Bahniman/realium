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
        "glow-card group/card relative rounded-2xl p-6 transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Tech brackets for cybernetic aesthetic */}
      {showTechBrackets && (
        <>
          <div className="tech-bracket-tl transition-all duration-300 opacity-20 group-hover/card:opacity-70 group-hover/card:scale-105" />
          <div className="tech-bracket-tr transition-all duration-300 opacity-20 group-hover/card:opacity-70 group-hover/card:scale-105" />
          <div className="tech-bracket-bl transition-all duration-300 opacity-20 group-hover/card:opacity-70 group-hover/card:scale-105" />
          <div className="tech-bracket-br transition-all duration-300 opacity-20 group-hover/card:opacity-70 group-hover/card:scale-105" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

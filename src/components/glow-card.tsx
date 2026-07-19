import React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showTechBrackets?: boolean;
}

export function GlowCard({
  children,
  className,
  showTechBrackets = false,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "group/card relative overflow-hidden rounded-[16px] border border-outline-variant bg-surface-container p-6 transition-all duration-300 hover:bg-surface-container-high hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

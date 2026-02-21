import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

// Reusable card component with subtle shadow and smooth hover effect
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-[12px] shadow-sm 
        transition-all duration-300 ease-out 
        hover:scale-[1.02] hover:shadow-md
        will-change-transform backface-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
}

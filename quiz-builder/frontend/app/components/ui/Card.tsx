import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover = false }: CardProps) {
  const hoverClasses = hover ? "hover:shadow-lg transition-shadow duration-200" : "";
  return (
    <div className={`card ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

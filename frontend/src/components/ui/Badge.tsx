import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${className}`}
    >
      {children}
    </span>
  );
};

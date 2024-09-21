import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  className,
  onClick,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-8 py-3 font-semibold rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

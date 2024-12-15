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
      className={`px-4 py-2 font-semibold rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

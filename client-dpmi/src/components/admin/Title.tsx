import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({ children, className }: TitleProps) {
  return (
    <h1
      className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight 
      text-gray-500 ${className || ''}`}
    >
      {children}
    </h1>
  );
}

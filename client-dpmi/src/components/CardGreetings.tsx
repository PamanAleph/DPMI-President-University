import React from "react";
import { greetings } from "@/app/lib/data";

export default function CardGreetings() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <p className="text-gray-800 text-md leading-relaxed text-justify whitespace-pre-wrap">
        {greetings.description}
      </p>
    </div>
  );
}

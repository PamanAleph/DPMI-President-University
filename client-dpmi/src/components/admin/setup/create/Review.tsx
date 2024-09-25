import Sections from "@/models/section";
import React from "react";

interface ReviewProps {
  sections: Sections[];
}

export default function Review({ sections }: ReviewProps) {
  return (
    <div>
      <h2>Review Sections</h2>
      {sections.map((section, index) => (
        <div key={index}>
          <p>Section Name: {section.section_name}</p>
          <p>Sequence: {section.sequence}</p>
        </div>
      ))}
    </div>
  );
}

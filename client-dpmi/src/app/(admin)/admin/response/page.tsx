import MajorCard from "@/components/admin/MajorCard";
import React from "react";
import { majors } from "@/app/lib/major";

export default function page() {
    
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-screen">
      {majors.map((major, index) => (
        <MajorCard key={index} name={major} />
      ))}
    </section>
  );
}

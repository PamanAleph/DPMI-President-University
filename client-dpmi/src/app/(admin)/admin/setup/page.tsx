import Button from "@/components/admin/Button";
import React from "react";

export default function Page() {
  return (
    <section>
      <Button className="bg-green-500 text-white">
        Add New Major
    </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-screen"></div>
    </section>
  );
}

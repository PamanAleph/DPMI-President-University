import React from "react";

export default function Page() {
  return (
    <section>
      <div className="flex justify-end">
        <button
          type="button"
          className="px-8 py-3 font-semibold rounded bg-green-500 text-white"
        >
          Add New Form
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-screen"></div>
    </section>
  );
}

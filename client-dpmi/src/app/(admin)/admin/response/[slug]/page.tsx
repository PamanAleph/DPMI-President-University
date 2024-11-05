import { findMajorBySlug } from "@/service/api/major";
import { redirect } from "next/navigation";
import React from "react";
import Major from "@/models/major";

interface MajorDetailsPageProps {
  params: { slug: string };
}

export default async function MajorDetailsPage({
  params,
}: MajorDetailsPageProps) {
  if (!params.slug || params.slug.length < 1) {
    return redirect("/404");
  }

  const major: Major | null = await findMajorBySlug(params.slug);

  if (!major) {
    return redirect("/404");
  }

  return (
    <section className="container mx-auto ">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 transition-all transform hover:scale-105">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 border-b-2 pb-4 text-center">
          {major.name}
        </h1>

        <div className="space-y-4 text-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-lg">
              <strong>Major Head:</strong> {major.head || "Not Assigned"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">
              <strong>Email:</strong> {major.emails || "Not Assigned"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">
              <strong>Created At:</strong>{" "}
              {new Date(major.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

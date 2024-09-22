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

  let emails: string[] = [];

  try {
    if (major.emails && typeof major.emails === "string") {
      const parsedEmails = JSON.parse(major.emails);

      if (
        Array.isArray(parsedEmails) &&
        parsedEmails.every((item) => typeof item === "string")
      ) {
        emails = parsedEmails;
      }
    }
  } catch (error) {
    console.error("Error parsing emails:", error);
  }

  return (
    <section className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{major.major_name}</h1>
      <p className="text-lg">
        Major Head: {major.major_head || "Not Assigned"}
      </p>
      <p className="text-lg">
        Emails: {emails.length > 0 ? emails.join(", ") : "No Emails Provided"}
      </p>
      <p className="text-lg">
        Created At: {new Date(major.created_at).toLocaleDateString()}
      </p>
    </section>
  );
}

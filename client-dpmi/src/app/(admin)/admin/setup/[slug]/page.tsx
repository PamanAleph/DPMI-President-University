import Button from "@/components/admin/Button";
import { fetchSetupBySlug } from "@/service/api/setup";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface SetupDetailsPageProps {
  params: { slug: string };
}

export default async function SetupDetailsPage({
  params,
}: SetupDetailsPageProps) {
  if (!params.slug || params.slug.length < 1) {
    return redirect("/404");
  }

  const setup = await fetchSetupBySlug(params.slug);

  if (!setup) {
    return redirect("/404");
  }

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Setup Details</h1>

      {/* Setup Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Setup ID</h2>
          <p className="text-lg text-gray-600">{setup.id}</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Setup Name
          </h2>
          <p className="text-lg text-gray-600">{setup.name}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Created At
          </h2>
          <p className="text-lg text-gray-600">
            {new Date(setup.create_at).toLocaleDateString()}
          </p>
        </div>

        {/* Sections and Questions Table */}
        <div className="md:col-span-2 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Sections & Questions
          </h2>
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
            <thead className="bg-gray-200">
              <tr className="text-center">
                <th className="py-2 px-4 text-gray-700 border border-gray-300 w-0.5/6">
                  Sequence
                </th>
                <th className="py-2 px-4 text-gray-700 border border-gray-300 w-1/6">
                  Section Name
                </th>
                <th className="py-2 px-4 text-gray-700 border border-gray-300 w-5/6">
                  Questions
                </th>
              </tr>
            </thead>
            <tbody>
              {setup.sections.map((section, sectionIndex) => (
                <tr
                  key={sectionIndex}
                  className="border-b text-center hover:bg-gray-50"
                >
                  <td className="py-2 px-4 text-gray-600 border border-gray-300">
                    {section.sequence}
                  </td>
                  <td className="py-2 px-4 text-gray-600 border border-gray-300">
                    {section.name}
                  </td>
                  <td className="border border-gray-300">
                    {/* Table for Questions */}
                    <table className="min-w-full bg-gray-50 text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="py-1 px-1 text-gray-600 border border-gray-300 w-[5%]">
                            No
                          </th>
                          <th className="py-1 px-1 text-gray-600 border border-gray-300 w-[10%]">
                            Question ID
                          </th>
                          <th className="py-1 px-1 text-gray-600 border border-gray-300 w-[10%]">
                            Parent ID
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[15%]">
                            Type
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[25%]">
                            Options
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[35%]">
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.questions.map((question, questionIndex) => (
                          <tr key={questionIndex} className="border-b">
                            <td className="py-1 px-1 text-gray-500 border border-gray-300">
                              {question.sequence}
                            </td>
                            <td className="py-1 px-1 text-gray-500 border border-gray-300">
                              {question.id}
                            </td>
                            <td className="py-1 px-1 text-gray-500 border border-gray-300">
                              {question.parent_id || "-"}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border border-gray-300">
                              {question.type}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border border-gray-300">
                              {/* Render Options if available */}
                              {question.options &&
                              question.options.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <li key={optionIndex}>
                                        {option.option} (Score: {option.score})
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p>No options available</p>
                              )}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border border-gray-300">
                              {question.question}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="mt-6 md:col-span-2">
          <Link href="/admin/setup">
            <Button className="bg-green-600 text-white rounded-md hover:bg-green-700">
              Back to Setup List
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

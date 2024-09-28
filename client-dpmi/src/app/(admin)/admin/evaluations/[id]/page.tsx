import EvaluationDetails from "@/models/evaluationDetails";
import { fetchEvaluationById } from "@/service/api/evaluation";
import { redirect } from "next/navigation";
import React from "react";

interface EvaluationDetailsPageProps {
  params: { id: string };
}

export default async function EvaluationDetailsPage({
  params,
}: EvaluationDetailsPageProps) {
  if (!params.id || params.id.length < 1) {
    return redirect("/404");
  }

  const evaluation: EvaluationDetails | null = await fetchEvaluationById(
    params.id
  );

  if (!evaluation) {
    return redirect("/404");
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Evaluation Details
      </h1>

      {/* Main Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Evaluasi {evaluation.id}
        </h2>
        <div className="mt-4 space-y-2 text-gray-600">
          <p>
            <span className="font-semibold">Setup ID:</span>{" "}
            {evaluation.setup_id}
          </p>
          <p>
            <span className="font-semibold">Major ID:</span>{" "}
            {evaluation.major_id.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Semester:</span>{" "}
            {evaluation.semester}
          </p>
          <p>
            <span className="font-semibold">End Date:</span>{" "}
            {new Date(evaluation.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Major Names */}
      <div className="bg-gray-50 p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Major Names
        </h2>
        <ul className="space-y-2">
          {evaluation.major_names.map((major, index) => (
            <li key={index} className="text-gray-600">
              {major}
            </li>
          ))}
        </ul>
      </div>

      {/* Setup Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Setup</h2>
        <p className="text-gray-600">
          <span className="font-semibold">Setup ID:</span> {evaluation.setup.id}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Name:</span> {evaluation.setup.name}
        </p>

        {/* Sections Table */}
        <h3 className="text-lg font-semibold text-gray-700 mt-6">Sections</h3>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr className="text-center">
                <th className="py-2 px-4 text-gray-700 border-l border-r border-t border-b">
                  Section ID
                </th>
                <th className="py-2 px-4 text-gray-700 border-l border-r border-t border-b">
                  Section Name
                </th>
                <th className="py-2 px-4 text-gray-700 border-l border-r border-t border-b">
                  Sequence
                </th>
                <th className="py-2 px-4 text-gray-700 border-l border-r border-t border-b">
                  Questions
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluation.setup.sections.map((section, sectionIndex) => (
                <tr key={sectionIndex} className="border-b text-center">
                  <td className="py-2 px-4 text-gray-600 border-l border-r border-b">
                    {section.id}
                  </td>
                  <td className="py-2 px-4 text-gray-600 border-l border-r border-b">
                    {section.section_name}
                  </td>
                  <td className="py-2 px-4 text-gray-600 border-l border-r border-b">
                    {section.sequence}
                  </td>
                  <td>
                    {/* Table for Questions */}
                    <table className="min-w-full bg-gray-50 text-left">
                      <thead>
                        <tr>
                          <th className="py-1 px-2 text-gray-600 border-l border-r border-t border-b">
                            No
                          </th>
                          <th className="py-1 px-2 text-gray-600 border-l border-r border-t border-b">
                            Question ID
                          </th>
                          <th className="py-1 px-2 text-gray-600 border-l border-r border-t border-b">
                            Parent ID
                          </th>
                          <th className="py-1 px-2 text-gray-600 border-l border-r border-t border-b">
                            Type
                          </th>
                          <th className="py-1 px-2 text-gray-600 border-l border-r border-t border-b">
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.questions.map((question, questionIndex) => (
                          <tr key={questionIndex} className="border-b">
                            <td className="py-1 px-2 text-gray-500 border-l border-r border-b">
                              {questionIndex + 1}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border-l border-r border-b">
                              {question.id}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border-l border-r border-b">
                              {section.questions.findIndex(
                                (q) => q.id === question.parent_id
                              ) + 1 || "Tidak ada parent"}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border-l border-r border-b">
                              {question.question_type}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border-l border-r border-b w-full overflow-wrap-break-word">
                              {question.question_data}
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
      </div>
    </div>
  );
}

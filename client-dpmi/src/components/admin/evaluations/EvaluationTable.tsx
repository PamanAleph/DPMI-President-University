import React from "react";
import Evaluation from "@/models/evaluation";
import EvaluationActions from "./EvaluationActions";

interface EvaluationTableProps {
  evaluations: Evaluation[];
}

export default function EvaluationTable({ evaluations }: EvaluationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              No
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Semester
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              End Date
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-center">
          {evaluations.map((evaluation, index) => (
            <tr key={evaluation.id}>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {index + 1}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[150px]">
                {evaluation.semester}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[200px]">
                {new Date(evaluation.end_date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-center">
                <EvaluationActions evaluationId={evaluation.id} evaluation={evaluation} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";
import EvaluationDetails from "@/models/evaluationDetails";
import { fetchEvaluationById } from "@/service/api/evaluation";
import { updateAnswerScore } from "@/service/api/answer";
import { redirect } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import SkeletonLoader from "@/components/admin/evaluations/SkeletonLoader";
import { getAccessToken } from "@/utils/sessionStorage";

interface EvaluationDetailsPageProps {
  params: { id: string };
}

export default function EvaluationDetailsPage({
  params,
}: EvaluationDetailsPageProps) {
  const [evaluation, setEvaluation] = useState<EvaluationDetails | null>(null);
  const [scores, setScores] = useState<{ questionId: number; score: number }[]>(
    []
  );

  const accessToken = getAccessToken();

  const fetchData = useCallback(async () => {
    const evaluationData = await fetchEvaluationById(Number(params.id), accessToken as string);
    if (!evaluationData) {
      redirect("/404");
    } else {
      setEvaluation(evaluationData);
      setScores(
        evaluationData.setup.sections.flatMap((section) =>
          section.questions.map((question) => ({
            questionId: question.id,
            score: question.answer?.score || 0,
          }))
        )
      );
    }
  }, [params.id, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScoreChange = (questionId: number, newScore: number) => {
    setScores((prevScores) =>
      prevScores.map((score) =>
        score.questionId === questionId ? { ...score, score: newScore } : score
      )
    );
  };

  const handleSaveScore = async (
    questionId: number,
    score: number,
    evaluationId: number
  ) => {
    try {
      Swal.fire({
        title: "Updating...",
        text: "Please wait while the evaluation is being updated.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await updateAnswerScore({ questionId, score, evaluationId}, accessToken as string);
      Swal.close();
      Swal.fire("Success", "Score saved successfully.", "success");
    } catch (error) {
      console.error("Error saving score:", error);
      Swal.fire("Error", "Failed to save score.", "error");
    }
  };

  if (!evaluation) {
    return SkeletonLoader();
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Evaluation Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Evaluasi {evaluation.id}
          </h2>
          <div className="mt-4 space-y-2 text-gray-600 grid grid-cols-1 md:grid-cols-2">
            <p>
              <span className="font-semibold">Setup ID:</span>{" "}
              {evaluation.setup_id}
            </p>
            <p>
              <span className="font-semibold">Major ID:</span>{" "}
              {evaluation.major_id}
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

        <div className="bg-white p-6 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Major Name
          </h2>
          <ul className="space-y-2">
            <li className="text-gray-600">{evaluation.major_name}</li>
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Setup</h2>
        <p className="text-gray-600">
          <span className="font-semibold">Setup ID:</span> {evaluation.setup.id}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Name:</span> {evaluation.setup.name}
        </p>

        <h3 className="text-lg font-semibold text-gray-700 mt-6">Form Data</h3>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
            <thead className="bg-gray-200">
              <tr className="text-center">
                <th className="py-2 px-2 text-gray-700 border border-gray-300 w-[5%]">
                  Section Sequence
                </th>
                <th className="py-2 px-4 text-gray-700 border border-gray-300 w-[25%]">
                  Section Name
                </th>
                <th className="py-2 px-4 text-gray-700 border border-gray-300 w-[70%]">
                  Questions
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluation.setup.sections.map((section, sectionIndex) => (
                <tr
                  key={sectionIndex}
                  className="border-b text-center hover:bg-gray-50"
                >
                  <td className="py-2 px-2 text-gray-600 border border-gray-300">
                    {section.sequence}
                  </td>
                  <td className="py-2 px-4 text-gray-600 border border-gray-300 text-justify">
                    {section.name}
                  </td>
                  <td className="border border-gray-300">
                    <table className="min-w-full bg-gray-50 text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="py-1 px-1 text-gray-600 border border-gray-300 w-[5%]">
                            No
                          </th>
                          <th className="py-1 px-1 text-gray-600 border border-gray-300 w-[10%]">
                            Parent ID
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[15%]">
                            Type
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[30%]">
                            Question
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[20%]">
                            Answer
                          </th>
                          <th className="py-1 px-2 text-gray-600 border border-gray-300 w-[20%]">
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.questions.map((question, questionIndex) => (
                          <tr
                            key={questionIndex}
                            className="border-b text-justify"
                          >
                            <td className="py-1 px-1 text-gray-500 border border-gray-300 text-center">
                              {question.sequence}
                            </td>
                            <td className="py-1 px-1 text-gray-500 border border-gray-300 text-center">
                              {question.parent_id || "-"}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border border-gray-300">
                              {question.type}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border border-gray-300">
                              {question.question}
                            </td>
                            <td className="py-1 px-2 text-gray-500 border border-gray-300">
                              {question.answer?.answer || "-"}
                            </td>
                            <td className="py-1 px-2 text-gray-500 flex items-center gap-2">
                              <input
                                type="text"
                                className="border p-1 rounded text-center w-16"
                                value={
                                  scores.find(
                                    (score) => score.questionId === question.id
                                  )?.score || 0
                                }
                                onChange={(e) =>
                                  handleScoreChange(
                                    question.id,
                                    Number(e.target.value)
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  handleSaveScore(
                                    question.id,
                                    scores.find(
                                      (score) =>
                                        score.questionId === question.id
                                    )?.score || 0,
                                    evaluation.id
                                  )
                                }
                                className="px-4 py-1 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                              >
                                Save
                              </button>
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

"use client";

import React, { useEffect, useState } from "react";
import { fetchEvaluationById } from "@/service/api/evaluation";
import EvaluationDetails from "@/models/evaluationDetails";
import { useRouter } from "next/navigation";
import { decryptId } from "@/utils/crypto";
import Questions from "@/models/questions";
import { updateAnswer } from "@/service/api/answer";
import Swal from "sweetalert2";
import FormExpired from "@/components/form/FormExpired";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-gray-300 h-8 w-2/3 rounded-lg mb-6"></div>
      <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
        <div className="bg-gray-300 h-6 w-1/2 mb-4 rounded-lg"></div>
        <div className="space-y-4">
          <div className="bg-gray-300 h-5 w-full rounded-lg mb-2"></div>
          <div className="bg-gray-300 h-5 w-3/4 rounded-lg mb-2"></div>
          <div className="bg-gray-300 h-5 w-1/2 rounded-lg mb-2"></div>
        </div>
      </div>
    </div>
  );
};

interface EvaluationDetailsPageProps {
  params: { id: string };
}

export default function EvaluationDetailsPage({
  params,
}: EvaluationDetailsPageProps) {
  const [evaluation, setEvaluation] = useState<EvaluationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const encryptedId = params.id;
    const decryptedId = decryptId(encryptedId);

    if (!decryptedId) {
      router.push("/");
      return;
    }

    const fetchEvaluation = async () => {
      const apiResponse: EvaluationDetails | null = await fetchEvaluationById(
        decryptedId
      );
      if (!apiResponse) {
        console.error("No evaluation found for the provided ID.");
        router.push("/");
      } else {
        setEvaluation(apiResponse);
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [params.id, router]);

  if (loading) {
    return <SkeletonLoader />;
  }

  const renderInputField = (question: Questions) => {
    const answerValue = question.answer?.answer || "";

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            placeholder={question.question}
            defaultValue={answerValue}
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            placeholder={question.question}
            defaultValue={answerValue}
            step="any"
          />
        );
      case "textarea":
        return (
          <textarea
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all resize-none shadow-sm"
            placeholder={question.question}
            defaultValue={answerValue}
          ></textarea>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={`question_${question.id}`}
              className="h-5 w-5 text-blue-600 border border-gray-300 rounded-md focus:ring-blue-500"
              defaultChecked={answerValue === "true"}
            />
            <label className="text-gray-800 font-medium">
              {question.question}
            </label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            placeholder={question.question}
            defaultValue={answerValue}
          />
        );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!evaluation) return;

    try {
      const answers = evaluation.setup.sections
        .flatMap((section) =>
          section.questions.map((question) => {
            const answerInput = document.getElementsByName(
              `question_${question.id}`
            )[0] as HTMLInputElement | HTMLTextAreaElement | null;

            if (answerInput) {
              const answerText =
                answerInput.type === "checkbox"
                  ? (answerInput as HTMLInputElement).checked
                    ? "true"
                    : "false"
                  : answerInput.value;

              const answerId = question.answer?.id;

              if (answerId !== undefined && answerId !== null) {
                return {
                  id: answerId,
                  answer: answerText,
                  score: question.answer?.score || 0,
                };
              }
            }
            return null;
          })
        )
        .filter(
          (answer): answer is { id: number; answer: string; score: number } =>
            answer !== null
        );

      await updateAnswer(answers);

      Swal.fire({
        title: "Success!",
        text: "All answers submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
        timerProgressBar: true,
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `There was an error submitting your answers. ${error}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const isFormExpired = () => {
    if (!evaluation || !evaluation.end_date) return false;
    return new Date() > new Date(evaluation.end_date);
  };

  if (isFormExpired()) {
    return <FormExpired />;
  }

  if (!evaluation) {
    return <SkeletonLoader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-gray-50 shadow-xl rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Evaluation ID: {evaluation.id}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p>
              <span className="font-semibold text-gray-600">Setup Name:</span>{" "}
              {evaluation.setup.name}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Major Name:</span>{" "}
              {evaluation.major_name}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Semester:</span>{" "}
              {evaluation.semester}
            </p>
            <p>
              <span className="font-semibold text-gray-600">End Date:</span>{" "}
              {new Date(evaluation.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {evaluation.setup.sections.map((section) => (
          <div
            key={section.id}
            className="bg-white shadow-lg rounded-xl p-8 transition-all mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">
              {section.name}
            </h2>
            {section.questions.map((question) => (
              <div key={question.id} className="mb-8">
                <label className="block text-gray-700 font-medium mb-2 text-justify">
                  {question.sequence}. {question.question}
                </label>
                {renderInputField(question)}
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
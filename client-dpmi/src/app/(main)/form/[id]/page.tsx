"use client";

import React, { useEffect, useState } from "react";
import { fetchEvaluationById } from "@/service/api/evaluation";
import EvaluationDetails from "@/models/evaluationDetails";
import { useRouter } from "next/navigation";
import { decryptId } from "@/utils/crypto";
import Questions from "@/models/questions";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-gray-200 h-8 w-2/3 rounded-lg mb-6"></div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="bg-gray-200 h-6 w-1/2 mb-4 rounded-lg"></div>
        <div className="space-y-4">
          <div className="bg-gray-200 h-5 w-full rounded-lg mb-2"></div>
          <div className="bg-gray-200 h-5 w-3/4 rounded-lg mb-2"></div>
          <div className="bg-gray-200 h-5 w-1/2 rounded-lg mb-2"></div>
        </div>
      </div>
    </div>
  );
};

interface EvaluationDetailsPageProps {
  params: { id: string };
}

export default function EvaluationDetailsPage({ params }: EvaluationDetailsPageProps) {
  const [evaluation, setEvaluation] = useState<EvaluationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const encryptedId = params.id;
    const decryptedId = decryptId(encryptedId);

    if (!decryptedId) {
      console.error("Decrypted ID is invalid or empty.");
      router.push("/");
      return;
    }

    const fetchEvaluation = async () => {
      const apiResponse: EvaluationDetails | null = await fetchEvaluationById(decryptedId);
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
            placeholder={question.question}
            defaultValue={answerValue}
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
            placeholder={question.question}
            defaultValue={answerValue}
          />
        );
      case "textarea":
        return (
          <textarea
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all resize-none"
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
              className="h-5 w-5 text-blue-500 border border-gray-300 rounded-md focus:ring-blue-500"
              defaultChecked={answerValue === "true"}
            />
            <label className="text-gray-600">{question.question}</label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            name={`question_${question.id}`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
            placeholder={question.question}
            defaultValue={answerValue}
          />
        );
    }
  };

  if (!evaluation) {
    return <SkeletonLoader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Evaluation Details</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 transition-all">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Evaluasi {evaluation.id}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p>
            <span className="font-semibold text-gray-600">Setup Name:</span> {evaluation.setup.name}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Major Name:</span> {evaluation.major_name}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Semester:</span> {evaluation.semester}
          </p>
          <p>
            <span className="font-semibold text-gray-600">End Date:</span>{" "}
            {new Date(evaluation.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {evaluation.setup.sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-xl p-8 mb-6 transition-all">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{section.name}</h2>
          {section.questions.map((question) => (
            <div key={question.id} className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                {question.question}
              </label>
              {renderInputField(question)}
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

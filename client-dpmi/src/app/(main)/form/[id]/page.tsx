"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from "react";
import { fetchEvaluationById } from "@/service/api/evaluation";
import EvaluationDetails from "@/models/evaluationDetails";
import { useRouter } from "next/navigation";
import { decryptId } from "@/utils/crypto";
import Questions from "@/models/questions";

// Skeleton Loader
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse max-w-4xl mx-auto p-4">
      <div className="bg-gray-200 h-8 w-2/3 mb-6 rounded"></div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="bg-gray-200 h-6 w-1/2 mb-4 rounded"></div>
        <div className="space-y-4">
          <div className="bg-gray-200 h-5 w-full rounded mb-2"></div>
          <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-200 h-5 w-1/2 rounded mb-2"></div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="bg-gray-200 h-6 w-1/3 mb-4 rounded"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="mb-4">
              <div className="bg-gray-200 h-5 w-1/2 mb-2 rounded"></div>
              <div className="bg-gray-200 h-10 w-full rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <div className="bg-gray-200 h-10 w-32 rounded"></div>
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
    console.log("Received ID param:", encryptedId);

    // Decrypt the ID
    const decryptedId = decryptId(encryptedId);
    console.log("Decrypted ID:", decryptedId);

    // If decryption fails, redirect to home
    if (!decryptedId) {
      console.error("Decrypted ID is invalid or empty.");
      router.push("/");
      return;
    }

    // Fetch evaluation data with the decrypted ID
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

  // Show skeleton while loading
  if (loading) {
    return <SkeletonLoader />;
  }

  // Render the input field based on question type
  const renderInputField = (question: Questions) => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            name={`question_${question.id}`}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder={question.question}
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={`question_${question.id}`}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder={question.question}
          />
        );
      case "textarea":
        return (
          <textarea
            name={`question_${question.id}`}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder={question.question}
          ></textarea>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={`question_${question.id}`}
              className="h-4 w-4"
            />
            <label>{question.question}</label>
          </div>
        );
      case "radio":
        return (
          <div>
            <input type="radio" name={`question_${question.id}`} className="mr-2" />
            <label>{question.question}</label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            name={`question_${question.id}`}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder={question.question}
          />
        );
    }
  };

  if (!evaluation) {
    return <SkeletonLoader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Evaluation Details
      </h1>

      {/* Main Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Evaluasi {evaluation.id}
        </h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <span className="font-semibold">Setup Name:</span> {evaluation.setup.name}
          </p>
          <p>
            <span className="font-semibold">Major Name:</span> {evaluation.major_name}
          </p>
          <p>
            <span className="font-semibold">Semester:</span> {evaluation.semester}
          </p>
          <p>
            <span className="font-semibold">End Date:</span>{" "}
            {new Date(evaluation.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Render Sections */}
      {evaluation.setup.sections.map((section) => (
        <div key={section.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {section.name}
          </h2>

          {/* Render Questions */}
          {section.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                {question.question}
              </label>
              {renderInputField(question)}
            </div>
          ))}
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

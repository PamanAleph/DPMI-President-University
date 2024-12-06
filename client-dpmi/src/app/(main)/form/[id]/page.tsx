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
import { getAccessToken } from "@/utils/sessionStorage";

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
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>(
    {}
  );
  const router = useRouter();
  const accessToken = getAccessToken();

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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: number
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/x-zip-compressed",
      "application/vnd.rar",
    ];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Only PDF, ZIP, and RAR files are allowed.",
        icon: "error",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      Swal.fire({
        title: "File Too Large",
        text: "The file size should not exceed 5 MB.",
        icon: "error",
      });
      return;
    }

    // Set the uploaded file
    setUploadedFiles((prev) => ({ ...prev, [questionId]: [file] }));
  };

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
      case "radio":
        return (
          <div>
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option.option}
                  data-score={option.score}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  defaultChecked={answerValue === option.option}
                />
                <span className="text-gray-800">{option.option}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={`question_${question.id}`}
                  value={option.option}
                  data-score={option.score}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  defaultChecked={answerValue === option.option}
                />
                <span className="text-gray-800">{option.option}</span>
              </label>
            ))}
          </div>
        );
      case "file":
        return (
          <div className="space-y-2">
            <input
              type="text"
              name={`question_${question.id}`}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              placeholder={question.question}
              defaultValue={answerValue}
            />
            <input
              type="file"
              name={`question_${question.id}`}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              multiple
              onChange={(e) => handleFileUpload(e, question.id)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!evaluation) return;

    try {
      Swal.fire({
        title: "Submitting...",
        text: "Please wait while the evaluation is being submitted.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const answersWithoutFiles: Array<{
        id: number;
        answer: string;
        score: number;
      }> = [];
      const fileAnswers: Array<{ id: number; files: File[] }> = [];

      evaluation.setup.sections.forEach((section) => {
        section.questions.forEach((question) => {
          const answerInputs = document.getElementsByName(
            `question_${question.id}`
          ) as NodeListOf<HTMLInputElement>;

          let answerText = "";
          let totalScore = 0;

          // Ensure `question.answer` is defined before accessing properties
          const questionAnswer = question.answer;
          if (question.type === "file" && uploadedFiles[question.id]) {
            const additionalTextInput =
              (
                document.querySelector(
                  `input[name="question_${question.id}_text"]`
                ) as HTMLInputElement
              )?.value || "";

            fileAnswers.push({
              id: questionAnswer?.id || 0,
              files: uploadedFiles[question.id],
            });

            answersWithoutFiles.push({
              id: questionAnswer?.id || 0,
              answer: additionalTextInput,
              score: totalScore,
            });

            return;
          } else {
            answerText = (answerInputs[0] as HTMLInputElement).value;
            totalScore = questionAnswer?.score ?? 0;
          }

          // Ensure `id` is defined before pushing into `answersWithoutFiles`
          if (questionAnswer?.id) {
            answersWithoutFiles.push({
              id: questionAnswer.id,
              answer: answerText,
              score: totalScore,
            });
          }
        });
      });

      await updateAnswer(answersWithoutFiles, fileAnswers , accessToken as string);

      Swal.close();
      Swal.fire({
        title: "Success!",
        text: "All answers submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
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

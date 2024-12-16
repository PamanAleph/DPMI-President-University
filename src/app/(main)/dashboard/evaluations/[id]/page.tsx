"use client";
import React, { useEffect, useState } from "react";
import { getEvaluationPage } from "@/service/api/evaluation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import logo from "@/assets/pu_logo_new.png";

interface EvaluationDetailsPageProps {
  params: { id: string };
}

interface EvaluationData {
  id: number;
  semester: string;
  end_date: string;
  major_id: number;
  major_name: string;
  setup_name: string;
  sections: {
    name: string;
    sequence: number;
    questions: {
      question: string;
      answer: string;
      score: number;
    }[];
  }[];
}

export default function Page({ params }: EvaluationDetailsPageProps) {
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getEvaluationPage({ id: Number(params.id) });
        setEvaluationData(data);
      } catch (err) {
        setError("Failed to fetch evaluation data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleExportPDF = () => {
    const input = document.getElementById("pdf-content");
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const position = 0;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        pdf.save(
          `evaluation_${evaluationData?.setup_name}_${evaluationData?.major_name}.pdf`
        );
      });
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600 animate-pulse">
        Loading...
      </div>
    );

  if (error || !evaluationData) {
    return (
      <div className="p-4 text-red-500 text-center font-semibold">
        {error || "No data found."}
      </div>
    );
  }

  return (
    <section className="pt-10 bg-gray-50 min-h-screen">
      <div className="py-4">
        <div className="flex justify-end px-6">
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
          >
            Export as PDF
          </button>
        </div>{" "}
      </div>
      {/* PDF Content */}
      <div id="pdf-content" className="px-6 py-4 bg-white rounded-lg shadow-md">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              President University
            </h1>
            <p className="text-gray-600">Evaluation Report</p>
          </div>
          <Image
            src={logo}
            alt="Logo"
            className="h-24 w-24"
            height={1080}
            width={1920}
          />
        </div>

        <div className=" mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Evaluation Details:{" "}
            <span className="text-blue-600">{evaluationData.setup_name}</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded-md">
              <p className="text-gray-700">
                <strong>Semester:</strong> {evaluationData.semester}
              </p>
              <p className="text-gray-700">
                <strong>End Date:</strong>{" "}
                {new Date(evaluationData.end_date).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded-md">
              <p className="text-gray-700">
                <strong>Major:</strong> {evaluationData.major_name}
              </p>
              <p className="text-gray-700">
                <strong>Major ID:</strong> {evaluationData.major_id}
              </p>
            </div>
          </div>
        </div>

        {/* Sections & Questions */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="py-2 px-4 border border-gray-300 w-[5%]">
                  Sequence
                </th>
                <th className="py-2 px-4 border border-gray-300 w-[25%]">
                  Section Name
                </th>
                <th className="py-2 px-4 border border-gray-300 w-[70%]">
                  Questions
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluationData.sections.map((section, sectionIndex) => (
                <tr key={sectionIndex} className="text-center hover:bg-gray-50">
                  <td className="border border-gray-300 py-2 px-4">
                    {section.sequence}
                  </td>
                  <td className="border border-gray-300 py-2 px-4 text-left">
                    {section.name}
                  </td>
                  <td className="border border-gray-300">
                    <table className="w-full bg-gray-50 border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-2 border border-gray-300 w-[10%]">
                            No
                          </th>
                          <th className="py-2 px-4 border border-gray-300 w-[50%] text-left">
                            Question
                          </th>
                          <th className="py-2 px-4 border border-gray-300 w-[20%]">
                            Answer
                          </th>
                          <th className="py-2 px-4 border border-gray-300 w-[20%]">
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.questions.map((question, questionIndex) => (
                          <tr
                            key={questionIndex}
                            className={`${
                              questionIndex % 2 === 0
                                ? "bg-white"
                                : "bg-gray-100"
                            }`}
                          >
                            <td className="border border-gray-300 py-2 px-2 text-center">
                              {questionIndex + 1}
                            </td>
                            <td className="border border-gray-300 py-2 px-4 text-left">
                              {question.question}
                            </td>
                            <td className="border border-gray-300 py-2 px-4 text-center">
                              {question.answer || "-"}
                            </td>
                            <td className="border border-gray-300 py-2 px-4 text-center">
                              {question.score !== null ? question.score : "-"}
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
    </section>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createQuestion } from "@/service/api/questions";
import Select from "react-select";
import Button from "../../Button";
import { fetchSetup } from "@/service/api/setup";

export default function QuestionDetails() {
  const [questions, setQuestions] = useState<{
    question_data: string;
    question_type: string;
    sequence: number;
    parent_id: number | null;
    section_id: number | null;
  }[]>([
    {
      question_data: "",
      question_type: "text",
      sequence: 1,
      parent_id: null,
      section_id: null,
    },
  ]);

  const [sections, setSections] = useState<
    { id: number; section_name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatestSetup() {
      try {
        const fetchedSetups = await fetchSetup();
        if (Array.isArray(fetchedSetups) && fetchedSetups.length > 0) {
          const latestSetup = fetchedSetups[fetchedSetups.length - 1];
          if (latestSetup.sections) {
            setSections(latestSetup.sections);
          }
        } else {
          throw new Error("No setups found.");
        }
      } catch (error) {
        console.error("Failed to fetch latest setup:", error);
        setError("Failed to load sections.");
      } finally {
        setLoading(false);
      }
    }

    loadLatestSetup();
  }, []);

  const handleQuestionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newQuestions = [...questions];
    const fieldName = event.target.name as keyof (typeof questions)[0];
    newQuestions[index][fieldName] = event.target.value as never;
    setQuestions(newQuestions);
  };

  const handleSectionChange = (
    index: number,
    selectedOption: { value: number; label: string } | null
  ) => {
    const newQuestions = [...questions];
    newQuestions[index].section_id = selectedOption
      ? selectedOption.value
      : null;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_data: "",
        question_type: "text",
        sequence: questions.length + 1, 
        parent_id: null,
        section_id: null,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const questionsData = questions.map(({ ...rest }) => ({
        ...rest,
      }));

      await Promise.all(
        questionsData.map((question) => createQuestion(question))
      );
      Swal.fire("Success", "Questions added successfully!", "success");
      setQuestions([
        {
          question_data: "",
          question_type: "text",
          sequence: 1,
          parent_id: null,
          section_id: null,
        },
      ]);
    } catch (error) {
      console.error("Failed to create questions:", error);
      Swal.fire("Error", "Failed to add questions!", "error");
    }
  };

  // Map sections to options for the Select component
  const sectionOptions = sections.map((section) => ({
    value: section.id,
    label: section.section_name,
  }));

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Question Details
      </h2>
      {loading ? (
        <p>Loading sections...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="flex flex-col space-y-4 mb-4">
              <Select
                name="section_id"
                options={sectionOptions}
                onChange={(option) => handleSectionChange(index, option)}
                className="mb-2"
                placeholder="Select Section"
                required
              />
              <input
                type="text"
                name="question_data"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Question ${index + 1}`}
                value={question.question_data}
                onChange={(e) => handleQuestionChange(index, e)}
                required
              />
              <select
                name="question_type"
                value={question.question_type}
                onChange={(e) => handleQuestionChange(index, e)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <p className="border border-gray-300 rounded-md p-2">
                Sequence: {index + 1}
              </p>
              <select
                name="parent_id"
                value={question.parent_id || ""}
                onChange={(e) => handleQuestionChange(index, e)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Parent</option>
                {questions.map((q, i) => (
                  <option key={i} value={i}>
                    Question {i + 1}
                  </option>
                ))}
              </select>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Add Another Question
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

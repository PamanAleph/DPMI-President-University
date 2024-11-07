"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { createQuestion } from "@/service/api/questions";
import Select from "react-select";
import Button from "../../Button";
import Questions from "@/models/questions";
import { useRouter } from "next/navigation";

export default function QuestionDetails() {
  const router = useRouter();

  // Initialize sections from localStorage directly
  const initialSections = JSON.parse(localStorage.getItem("section") || "[]");

  // Initialize questions from localStorage directly
  const initialQuestions = JSON.parse(localStorage.getItem("question") || "[]");

  const [sections] = useState<{ id: number; name: string }[]>(initialSections);
  const [questions, setQuestions] = useState<Questions[]>(initialQuestions);
  const [question, setQuestion] = useState<Omit<Questions, "id">>({
    question: "",
    type: "text",
    sequence: 1,
    parent_id: null,
    section_id: null,
    answer: null
  });

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleSectionChange = (
    selectedOption: { value: number | null; label: string } | null
  ) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      section_id: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleParentChange = (
    selectedOption: { value: number | null; label: string } | null
  ) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      parent_id: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.section_id) {
      Swal.fire("Error", "Please select a section!", "error");
      return;
    }

    try {
      // Create question with section_id only
      const payload = {
        question: question.question,
        type: question.type,
        sequence: question.sequence,
        section_id: question.section_id,
        parent_id: question.parent_id,
      };

      // API call to create question
      const createdQuestion = await createQuestion(payload);

      // Update questions in localStorage with new ID
      if (createdQuestion && createdQuestion.id) {
        const newQuestions = [...questions, createdQuestion];
        setQuestions(newQuestions);
        localStorage.setItem("question", JSON.stringify(newQuestions));

        Swal.fire("Success", "Question added successfully!", "success");

        // Reset question form
        setQuestion({
          question: "",
          type: "text",
          sequence: question.sequence + 1,
          parent_id: null,
          section_id: question.section_id,
          answer: null
        });
      } else {
        Swal.fire("Error", "Failed to retrieve question ID!", "error");
      }
    } catch (error) {
      console.error("Failed to create question:", error);
      Swal.fire("Error", "Failed to add question!", "error");
    }
  };

  const handleEndQuestions = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to end adding questions?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, end it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear all data in localStorage
        localStorage.clear();

        Swal.fire("Ended!", "Question session has ended.", "success");
        router.push("/admin/setup");
      }
    });
  };

  const sectionOptions = sections.map((section) => ({
    value: section.id,
    label: section.name,
  }));

  const parentOptions = [
    { value: null, label: "No Parent" },
    ...questions.map((q) => ({
      value: q.id,
      label: q.question,
    })),
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Question Details
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 mb-4">
          <Select
            name="section_id"
            options={sectionOptions}
            onChange={handleSectionChange}
            value={sectionOptions.find(
              (option) => option.value === question.section_id
            )}
            className="mb-2"
            placeholder="Select Section"
            required
          />
          <input
            type="text"
            name="question"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter question"
            value={question.question}
            onChange={handleQuestionChange}
            required
          />
          <select
            name="type"
            value={question.type}
            onChange={handleQuestionChange}
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
            Sequence: {question.sequence}
          </p>
          <Select
            name="parent_id"
            options={parentOptions}
            onChange={handleParentChange}
            className="mb-2"
            placeholder="Select Parent Question (optional)"
            value={
              parentOptions.find((option) => option.value === question.parent_id) ||
              null
            }
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Submit Question
          </Button>
          <Button
            type="button"
            onClick={handleEndQuestions}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            End Questions
          </Button>
        </div>
      </form>
    </div>
  );
}

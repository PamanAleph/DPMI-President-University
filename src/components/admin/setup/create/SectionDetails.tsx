"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { createSection } from "@/service/api/section";
import Button from "../../Button";
import Sections from "@/models/section";

interface SectionDetailsProps {
  onNext: () => void;
}

export default function SectionDetails({ onNext }: SectionDetailsProps) {
  const [setupId] = useState<number | null>(
    Number(localStorage.getItem("setupId")) || null
  );

  const [sections, setSections] = useState<Omit<Sections, "id" | "questions">[]>([
    { name: "", sequence: 0, setup_id: setupId ?? 0 },
  ]);

  const handleSectionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSections = [...sections];
    newSections[index].name = event.target.value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { name: "", sequence: 0, setup_id: setupId ?? 0 }]);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupId) {
      Swal.fire("Error", "No setup found!", "error");
      return;
    }

    try {
      const sectionsData = sections.map((section, index) => ({
        ...section,
        sequence: index + 1,
        setup_id: setupId,
      }));

      // Create sections via API
      const response = await createSection(sectionsData);

      // Check if response contains data
      if (response && response.data && response.data.length > 0) {
        // Extract ID and name from the response data
        const sectionDetails = response.data.map((section: Sections) => ({
          id: section.id,
          name: section.name,
        }));

        localStorage.setItem("section", JSON.stringify(sectionDetails));
        Swal.fire("Success", "Sections added successfully!", "success");
        setSections([{ name: "", sequence: 0, setup_id: setupId ?? 0 }]);
        onNext();
      } else {
        Swal.fire("Error", "No sections were created!", "error");
      }
    } catch (error) {
      console.error("Failed to create sections:", error);
      Swal.fire("Error", "Failed to add sections!", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Section Details
      </h2>
      <form onSubmit={handleSubmit}>
        {sections.map((section, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <span className="text-gray-500">{index + 1}.</span>
            <input
              type="text"
              name="section_name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Section Name ${index + 1}`}
              value={section.name}
              onChange={(e) => handleSectionChange(index, e)}
              required
            />
            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(index)}
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
            onClick={addSection}
            className="bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Add Another Section
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

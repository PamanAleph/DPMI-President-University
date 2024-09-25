"use client";
import React, { useState, useEffect } from "react";
import { fetchMajor } from "@/service/api/major";
import { createSetup } from "@/service/api/setup";
import Select, { OnChangeValue } from "react-select";
import Swal from "sweetalert2";
import Setup from "@/models/setup";

interface Major {
  id: number;
  major_name: string;
}

interface MajorOption {
  value: number;
  label: string;
}

export default function SetupDetails() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    semester: "",
    major_id: [] as number[],
    start_date: "",
    end_date: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  const [majors, setMajors] = useState<Major[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMajors() {
      try {
        const majorData = await fetchMajor();
        setMajors(majorData);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    }

    loadMajors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData({
        ...formData,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, "-"),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMajorSelect = (
    selectedOptions: OnChangeValue<MajorOption, true>
  ) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      major_id: selectedIds,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const setupData: Omit<Setup, "id" | "create_at" | "major_name"> = {
        name: formData.name,
        slug: formData.slug,
        semester: Number(formData.semester),
        major_id: [],
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
      };

      const result = await createSetup(setupData);
      console.log("Setup data being sent:", setupData);

      Swal.fire({
        title: "Success!",
        text: "Setup created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      console.log("Setup created successfully:", result);
    } catch (error) {
      setErrorMessage("Failed to create setup. Please try again.");
      Swal.fire({
        title: "Error!",
        text: "Failed to create setup. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const majorOptions = majors.map((major) => ({
    value: major.id,
    label: major.major_name,
  }));

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Create New Setup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter setup name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Semester:
          </label>
          <input
            type="number"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter semester"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Majors:
          </label>
          <Select
            isMulti
            options={majorOptions}
            onChange={handleMajorSelect}
            placeholder="Select majors"
            className="mt-1"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#3b82f6",
                },
              }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}

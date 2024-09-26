"use client";
import React, { useState } from "react";
import { createSetup } from "@/service/api/setup";
import Swal from "sweetalert2";
import Setup from "@/models/setup";

interface SetupDetailsProps {
  onNext: () => void;
}

export default function SetupDetails({ onNext }: SetupDetailsProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const setupData: Omit<Setup, "id"> = {
        name: formData.name,
        slug: formData.slug,
      };

      await createSetup(setupData);

      Swal.fire({
        title: "Success!",
        text: "Setup created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      onNext();
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

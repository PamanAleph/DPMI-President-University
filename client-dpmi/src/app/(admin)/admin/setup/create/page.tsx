"use client";
import Questions from "@/models/questions";
import Sections from "@/models/section";
import Setup from "@/models/setup";
import { fetchMajor } from "@/service/api/major";
import { useEffect, useState } from "react";
import Select from "react-select";

const steps = [
  {
    id: "01",
    name: "Form Details",
    description: "Enter Form Details",
    status: "current",
  },
  {
    id: "02",
    name: "Question Details",
    description: "Upload news thumbnail",
    status: "upcoming",
  },
  {
    id: "03",
    name: "Review & Create",
    description: "Review your form and create",
    status: "upcoming",
  },
];

interface NewsCreation {
  question: Questions[];
  section: Sections[];
  setup: Setup[];
}

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<NewsCreation>({
    question: [],
    section: [],
    setup: [],
  });
  const [major, setMajor] = useState<any[]>([]); // Adjust type as necessary
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<any | null>(null); // State for selected major

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const fetchedMajor = await fetchMajor();
        setMajor(fetchedMajor);
      } catch (err) {
        setError("Failed to fetch majors");
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Map major data to select options
  const majorOptions = major.map((m) => ({
    value: m.id,
    label: m.major_name,
  }));

  return (
    <div>
      <h1>Major Data</h1>
      <Select
        options={majorOptions}
        value={selectedMajor}
        isMulti
        onChange={setSelectedMajor}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
}

"use client";
import { createRoot } from "react-dom/client";
import React from "react";
import Swal from "sweetalert2";
import Button from "../Button";
import { updateEvaluation } from "@/service/api/evaluation";
import { fetchMajor } from "@/service/api/major"; 
import Link from "next/link";
import Select from "react-select"; 
import Evaluation from "@/models/evaluation";
import { fetchSetup } from "@/service/api/setup";
import Setup from "@/models/setup";


interface EvaluationActionsProps {
  evaluationId: number;
  evaluation: Evaluation;
}

export default function EvaluationActions({ evaluation }: EvaluationActionsProps) {
  
  const handleEditEvaluation = async () => {
    const evaluationData: Setup[] = await fetchSetup();
    
    // Fetch major data
    const majorResponse = await fetchMajor();
    const majorList = majorResponse.map((major: { id: number; major_name: string }) => ({
      id: major.id,
      major_name: major.major_name,
    }));
  
    // Map the selected major IDs to their names
    let selectedMajors: { label: string; value: number }[] = evaluation.major_id.map(
      (majorId: number) => {
        const major = majorList.find((major) => major.id === majorId);
        return {
          label: major ? major.major_name : "Unknown Major", // Fallback in case the major is not found
          value: majorId,
        };
      }
    );
  
    let selectedSetup: { label: string; value: number } = {
      label: evaluation.setup_name,
      value: evaluation.setup_id,
    };
  
    const { value: formValues } = await Swal.fire({
      title: "Edit Evaluation",
      html: `
        <div id="multi-select-major"></div>
        <div id="select-setup"></div>
        <input type="text" id="semester" class="swal2-input" value="${evaluation.semester}" placeholder="Semester" />
        <input type="date" id="end-date" class="swal2-input" value="${new Date(evaluation.end_date).toISOString().split('T')[0]}" placeholder="End Date" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const majorIds = selectedMajors.map((major) => major.value);
        const setupId = selectedSetup.value;
        const semester = (document.getElementById("semester") as HTMLInputElement)?.value;
        const end_date = (document.getElementById("end-date") as HTMLInputElement)?.value;
  
        if (!majorIds.length || !semester || !end_date || !setupId) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }
  
        return { setupId, majorIds, semester, end_date };
      },
      didOpen: async () => {
        // Render the major select
        const majorSelectContainer = document.getElementById("multi-select-major");
        if (majorSelectContainer) {
          const root = createRoot(majorSelectContainer);
          root.render(
            <Select
              options={majorList.map((major) => ({
                label: major.major_name,
                value: major.id,
              }))}
              isMulti
              value={selectedMajors}
              className="swal2-select"
              placeholder="Select Majors"
              onChange={(selectedOptions) => {
                selectedMajors = selectedOptions as { label: string; value: number }[];
              }}
            />
          );
        }
  
        // Render the setup select
        const setupSelectContainer = document.getElementById("select-setup");
        if (setupSelectContainer) {
          const setupOptions = evaluationData.map(
            (setup: Setup) => ({
              label: setup.name,
              value: setup.id,
            })
          );
  
          const root = createRoot(setupSelectContainer);
          root.render(
            <Select
              options={setupOptions}
              value={selectedSetup}
              className="swal2-select"
              placeholder="Select Setup"
              onChange={(selectedOption) => {
                selectedSetup = selectedOption as { label: string; value: number };
              }}
            />
          );
        }
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });
  
    if (formValues) {
      try {
        await updateEvaluation({
          id: evaluation.id,
          setup_id: formValues.setupId,
          major_id: formValues.majorIds,
          semester: formValues.semester,
          end_date: new Date(formValues.end_date),
        });
  
        Swal.fire("Updated!", "The evaluation has been updated.", "success").then(() => {
          window.location.reload();
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire("Error", `Failed to update the evaluation: ${errorMessage}`, "error");
      }
    }
  };
    
  return (
    <section className="flex gap-4 justify-center">
      <Link href={`evaluations/${evaluation.id}`}>
        <Button className="text-white bg-green-600">View</Button>
      </Link>
      <Button className="bg-yellow-400 text-white" onClick={handleEditEvaluation}>
        Edit
      </Button>
      {/* <Button className="bg-red-400 text-white" onClick={handlede}>
        Delete
      </Button> */}
    </section>
  );
}

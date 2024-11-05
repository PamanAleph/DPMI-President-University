"use client";
import { createRoot } from "react-dom/client";
import React from "react";
import Swal from "sweetalert2";
import Button from "../Button";
import { updateEvaluation, deleteEvaluation } from "@/service/api/evaluation";
import { fetchMajor } from "@/service/api/major";
import Link from "next/link";
import Select from "react-select";
import Evaluation from "@/models/evaluation";
import { fetchSetup } from "@/service/api/setup";
import Setup from "@/models/setup";
import Major from "@/models/major";
import { encryptId } from "@/utils/crypto";

interface EvaluationActionsProps {
  evaluationId: number;
  evaluation: Evaluation;
}

export default function EvaluationActions({
  evaluation,
}: EvaluationActionsProps) {
  const handleCopyLink = () => {
    const encryptedId = encryptId(evaluation.id ?? 0);
    localStorage.setItem("url" ,encryptedId)
    const formUrl = `${window.location.origin}/form/${encryptedId}`;
    navigator.clipboard
      .writeText(formUrl)
      .then(() => {
        Swal.fire(
          "Link Copied!",
          "The form link has been copied to your clipboard.",
          "success"
        );
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          "Failed to copy the link. Please try again.",
          "error"
        );
        console.error("Copy failed:", err);
      });
  };

  const handleEditEvaluation = async () => {
    const evaluationData: Setup[] = await fetchSetup();
    const majorResponse = await fetchMajor();
  
    // Define the list of majors with proper typing
    const majorList: { id: number; major_name: string }[] = majorResponse.map(
      (major: Major) => ({
        id: major.id,
        major_name: major.name,
      })
    );
  
    // Pre-select the current major of the evaluation
    const selectedMajor = majorList.find((major) => major.id === evaluation.major_id)
      ? { label: majorList.find((major) => major.id === evaluation.major_id)?.major_name || "Unknown Major", value: evaluation.major_id }
      : { label: "Unknown Major", value: 0 }; // Fallback if no major is found
  
    const selectedSetup = {
      label: evaluation.setup_name ?? "Unknown Setup",
      value: evaluation.setup_id,
    };
  
    const { value: formValues } = await Swal.fire({
      title: "Edit Evaluation",
      html: `
        <div id="select-major"></div>
        <div id="select-setup"></div>
        <input type="text" id="semester" class="swal2-input" value="${evaluation.semester}" placeholder="Semester" />
        <input type="date" id="end-date" class="swal2-input" value="${new Date(evaluation.end_date).toISOString().split("T")[0]}" placeholder="End Date" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const selectedMajorId = selectedMajor.value;
        const setupId = selectedSetup.value;
        const semester = (document.getElementById("semester") as HTMLInputElement)?.value;
        const end_date = (document.getElementById("end-date") as HTMLInputElement)?.value;
  
        if (!selectedMajorId || !semester || !end_date || !setupId) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }
  
        return { setupId, majorId: selectedMajorId, semester, end_date };
      },
      didOpen: async () => {
        const majorSelectContainer = document.getElementById("select-major");
        if (majorSelectContainer) {
          const root = createRoot(majorSelectContainer);
          root.render(
            <Select
              options={majorList.map((major) => ({
                label: major.major_name,
                value: major.id,
              }))}
              value={selectedMajor}
              className="swal2-select"
              placeholder="Select Major"
              onChange={(selectedOption) => {
                selectedMajor.label = selectedOption?.label || "Unknown Major";
                selectedMajor.value = selectedOption?.value || 0;
              }}
            />
          );
        }
  
        const setupSelectContainer = document.getElementById("select-setup");
        if (setupSelectContainer) {
          const setupOptions = evaluationData.map((setup: Setup) => ({
            label: setup.name,
            value: setup.id,
          }));
  
          const root = createRoot(setupSelectContainer);
          root.render(
            <Select
              options={setupOptions}
              value={selectedSetup ? [selectedSetup] : []}
              className="swal2-select"
              placeholder="Select Setup"
              onChange={(selectedOption) => {
                selectedSetup.label = selectedOption?.label || "Unknown Setup";
                selectedSetup.value = selectedOption?.value || 0;
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
          major_id: formValues.majorId,
          semester: formValues.semester,
          end_date: new Date(formValues.end_date),
        });
  
        Swal.fire("Updated!", "The evaluation has been updated.", "success").then(() => {
          window.location.reload();
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire("Error", `Failed to update the evaluation: ${errorMessage}`, "error");
      }
    }
  };
  
  

  const handleDeleteEvaluation = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEvaluation(evaluation.id ?? 0);
          Swal.fire(
            "Deleted!",
            "The evaluation has been deleted.",
            "success"
          ).then(() => {
            window.location.reload();
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          Swal.fire(
            "Error",
            `Failed to delete the evaluation: ${errorMessage}`,
            "error"
          );
        }
      }
    });
  };

  return (
    <section className="flex gap-4 justify-center">
      <Link href={`evaluations/${evaluation.id}`}>
        <Button className="text-white bg-green-600">View</Button>
      </Link>
      <Button
        className="bg-yellow-400 text-white"
        onClick={handleEditEvaluation}
      >
        Edit
      </Button>
      <Button
        className="bg-red-400 text-white"
        onClick={handleDeleteEvaluation}
      >
        Delete
      </Button>
      <Button className="bg-blue-500 text-white" onClick={handleCopyLink}>
        Copy Link
      </Button>
    </section>
  );
}

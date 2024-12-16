"use client";
import React from "react";
import Swal from "sweetalert2";
import Button from "../Button";
import { updateEvaluation, deleteEvaluation } from "@/service/api/evaluation";
import { fetchMajor } from "@/service/api/major";
import Link from "next/link";
import Evaluation from "@/models/evaluation";
import { fetchSetup } from "@/service/api/setup";
import Setup from "@/models/setup";
import Major from "@/models/major";
import { encryptId } from "@/utils/crypto";
import { getAccessToken } from "@/utils/sessionStorage";

interface EvaluationActionsProps {
  evaluationId: number;
  evaluation: Evaluation;
}

export default function EvaluationActions({
  evaluation,
}: EvaluationActionsProps) {
  const accessToken = getAccessToken();
  const handleCopyLink = () => {
    const encryptedId = encryptId(evaluation.id ?? 0);
    localStorage.setItem("url", encryptedId);
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
  
    const majorList: { id: number; major_name: string }[] = majorResponse.map(
      (major: Major) => ({
        id: major.id,
        major_name: major.name,
      })
    );
  
    const { value: formValues } = await Swal.fire({
      title: "Edit Evaluation",
      html: `
      <div class="space-y-4">
        <label for="major-select" class="block text-sm font-medium text-gray-700">
          Major
        </label>
        <div class="relative">
          <div class="border border-gray-300 rounded-md shadow-sm">
            <select
              id="major-select"
              class="block w-full px-4 py-2 appearance-none bg-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              style="max-height: 10rem; overflow-y: auto;"
            >
              ${majorList
                .map(
                  (major) =>
                    `<option value="${major.id}" ${
                      major.id === evaluation.major_id ? "selected" : ""
                    }>${major.major_name}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <label for="setup-select" class="block text-sm font-medium text-gray-700">
          Setup
        </label>
        <div class="relative">
          <div class="border border-gray-300 rounded-md shadow-sm">
            <select
              id="setup-select"
              class="block w-full px-4 py-2 appearance-none bg-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              style="max-height: 10rem; overflow-y: auto;"
            >
              ${evaluationData
                .map(
                  (setup) =>
                    `<option value="${setup.id}" ${
                      setup.id === evaluation.setup_id ? "selected" : ""
                    }>${setup.name}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <label for="semester" class="block text-sm font-medium text-gray-700">
          Semester
        </label>
        <input
          type="text"
          id="semester"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${evaluation.semester}"
          placeholder="Semester"
        />
        <label for="end-date" class="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${new Date(evaluation.end_date).toISOString().split("T")[0]}"
          placeholder="End Date"
        />
      </div>
    `,
      focusConfirm: false,
      preConfirm: () => {
        const selectedMajorId = (
          document.getElementById("major-select") as HTMLSelectElement
        )?.value;
        const selectedSetupId = (
          document.getElementById("setup-select") as HTMLSelectElement
        )?.value;
        const semester = (
          document.getElementById("semester") as HTMLInputElement
        )?.value;
        const end_date = (
          document.getElementById("end-date") as HTMLInputElement
        )?.value;
  
        if (!selectedMajorId || !selectedSetupId || !semester || !end_date) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }
  
        return {
          setupId: parseInt(selectedSetupId, 10),
          majorId: parseInt(selectedMajorId, 10),
          semester,
          end_date,
        };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });
  
    if (formValues) {
      try {
        Swal.fire({
          title: "Updating...",
          text: "Please wait while the evaluation is being updated.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        await updateEvaluation(
          {
            id: evaluation.id,
            setup_id: formValues.setupId,
            major_id: formValues.majorId,
            semester: formValues.semester,
            end_date: new Date(formValues.end_date),
          },
          accessToken as string
        );
  
        Swal.close();
        Swal.fire("Updated!", "The evaluation has been updated.", "success").then(
          () => {
            window.location.reload();
          }
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire(
          "Error",
          `Failed to update the evaluation: ${errorMessage}`,
          "error"
        );
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
          Swal.fire({
            title: "Updating...",
            text: "Please wait while the evaluation is being deleted.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await deleteEvaluation(evaluation.id ?? 0, accessToken as string);
          Swal.close();
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

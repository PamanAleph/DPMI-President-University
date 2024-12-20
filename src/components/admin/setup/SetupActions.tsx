"use client";
import { createRoot } from "react-dom/client";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import Button from "../Button";
import Setup from "@/models/setup";
import { deleteSetup, updateSetupNameAndSlug } from "@/service/api/setup";
import { checkEvaluation, createEvaluation } from "@/service/api/evaluation";
import { fetchMajor } from "@/service/api/major";
import Link from "next/link";
import Select from "react-select";
import { fetchQuestionBySetupId } from "@/service/api/questions";
import { createAnswer } from "@/service/api/answer";
import { getAccessToken } from "@/utils/sessionStorage";

interface SetupActionsProps {
  setupId: number;
  setup: Setup;
}

export default function SetupActions({ setupId, setup }: SetupActionsProps) {
  useEffect(() => {
    const getMajors = async () => {
      try {
        const majorsData = await fetchMajor();
        majorsData.map((major: { id: number; name: string }) => ({
          value: major.id,
          label: major.name,
        }));
      } catch (error) {
        console.error("Failed to fetch majors:", error);
      }
    };
    getMajors();
  }, []);

  const accessToken = getAccessToken();

  const handleEditSetup = async () => {
    const { value: setupData } = await Swal.fire({
      title: "Edit Setup",
      html: `<input type="text" id="setup-name" class="swal2-input" value="${setup.name}" placeholder="Setup Name"/>`,
      focusConfirm: false,
      preConfirm: () => {
        const setup_name = (
          document.getElementById("setup-name") as HTMLInputElement
        )?.value;

        if (!setup_name) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }

        const slug = setup_name.toLowerCase().replace(/\s+/g, "-");

        return { name: setup_name, slug };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (setupData) {
      try {
        Swal.fire({
          title: "Updating...",
          text: "Please wait while the setup is being updated.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await updateSetupNameAndSlug({
          id: setupId,
          name: setupData.name,
          slug: setupData.slug,
        });
        Swal.close();
        Swal.fire("Updated!", "The setup has been updated.", "success").then(
          () => {
            window.location.reload();
          }
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire(
          "Error",
          `Failed to update the setup: ${errorMessage}`,
          "error"
        );
      }
    }
  };

  const handleDeleteSetup = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this setup? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Deleting...",
            text: "Please wait while the setup is being deleted.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          await deleteSetup(setupId);
          Swal.close();
          Swal.fire("Deleted!", "The setup has been deleted.", "success").then(
            () => {
              window.location.reload();
            }
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          Swal.fire(
            "Error",
            `Failed to delete the setup: ${errorMessage}`,
            "error"
          );
        }
      }
    });
  };

  const handleGenerateEvaluation = async () => {
    let selectedMajors: { label: string; value: number }[] = [];

    const { value: formValues } = await Swal.fire({
      title: "Generate Evaluation",
      html: `
        <div id="multi-select-major"></div>
        <input type="text" id="semester" class="swal2-input" placeholder="Semester" />
        <input type="date" id="end-date" class="swal2-input" placeholder="End Date" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const majorIds = selectedMajors.map((major) => major.value);
        const semester = (
          document.getElementById("semester") as HTMLInputElement
        )?.value;
        const end_date = (
          document.getElementById("end-date") as HTMLInputElement
        )?.value;

        if (!majorIds.length || !semester || !end_date) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }

        return { majorIds, semester, end_date };
      },
      didOpen: async () => {
        const majorSelectContainer =
          document.getElementById("multi-select-major");
        if (majorSelectContainer) {
          const response = await fetchMajor();
          const majorOptions = response.map(
            (major: { id: number; name: string }) => ({
              label: major.name,
              value: major.id,
            })
          );

          const root = createRoot(majorSelectContainer);
          root.render(
            <Select
              options={majorOptions}
              isMulti
              className="swal2-select"
              placeholder="Select Majors"
              onChange={(selectedOptions) => {
                selectedMajors = selectedOptions as {
                  label: string;
                  value: number;
                }[];
              }}
            />
          );
        }
      },
      showCancelButton: true,
      confirmButtonText: "Generate",
      cancelButtonText: "Cancel",
    });

    if (formValues) {
      const majorIds = Array.isArray(formValues.majorIds)
        ? formValues.majorIds
        : [];
      try {
        Swal.fire({
          title: "Generating...",
          text: "Please wait while the evaluation is being Generated.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        for (const majorId of majorIds) {
          const evaluationCheckData = {
            setupId,
            majorIds: [majorId],
            semester: formValues.semester,
            endDate: new Date(formValues.end_date),
          };
          const evaluationExists = await checkEvaluation(evaluationCheckData,accessToken as string);

          if (evaluationExists) {
            Swal.fire(
              "Error",
              `An evaluation for major ${majorId}, semester ${formValues.semester}, and end date already exists.`,
              "error"
            );
            continue;
          }

          const evaluationData = {
            setup_id: setupId,
            major_id: majorId,
            semester: formValues.semester,
            end_date: new Date(formValues.end_date),
          };

          const evaluations = await createEvaluation(evaluationData, accessToken as string);
          const newEvaluation = Array.isArray(evaluations) ? evaluations[0] : evaluations;
          
          // Verifikasi `newEvaluation.id` sebagai number
          const evaluationId = Number(newEvaluation.id);
          
          const questions = await fetchQuestionBySetupId(setupId);

          for (const question of questions) {
            await createAnswer({
              evaluation_id: evaluationId,
              question_id: question.id,
              answer: null,
              score: null,
            }, accessToken as string);
          }
        }
        Swal.close();
        Swal.fire(
          "Success!",
          "Evaluations and answers generated successfully.",
          "success"
        ).then(() => {
          window.location.reload();
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire(
          "Error",
          `Failed to generate the evaluation and answers: ${errorMessage}`,
          "error"
        );
      }
    }
  };

  return (
    <section className="flex gap-4 justify-center">
      <Button
        onClick={handleGenerateEvaluation}
        className="bg-black text-white"
      >
        Generate
      </Button>
      <Link href={`setup/${setup.slug}`}>
        <Button className="text-white bg-green-600">View</Button>
      </Link>
      <Button className="bg-yellow-400 text-white" onClick={handleEditSetup}>
        Edit
      </Button>
      <Button className="bg-red-400 text-white" onClick={handleDeleteSetup}>
        Delete
      </Button>
    </section>
  );
}

"use client";
import Swal from "sweetalert2";
import Button from "../Button";
import React from "react";
import Setup from "@/models/setup";
import { deleteSetup, updateSetupNameAndSlug } from "@/service/api/setup";

interface SetupActionsProps {
  setupId: number;
  setup: Setup;
}

export default function SetupActions({ setupId, setup }: SetupActionsProps) {
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
  
        const slug = setup_name.toLowerCase().replace(/\s+/g, '-'); // Slug generation
  
        return { name: setup_name, slug };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });
  
    if (setupData) {
      try {
        await updateSetupNameAndSlug({ id: setupId, name: setupData.name, slug: setupData.slug });
        Swal.fire("Updated!", "The setup has been updated.", "success").then(() => {
          window.location.reload();  // Reload after update
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire("Error", `Failed to update the setup: ${errorMessage}`, "error");
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
          await deleteSetup(setupId);
          Swal.fire("Deleted!", "The setup has been deleted.", "success").then(
            () => {
              window.location.reload();  // Reload the page after deletion
            }
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
          Swal.fire("Error", `Failed to delete the setup: ${errorMessage}`, "error");
        }
      }
    });
  };

  return (
    <>
      <Button className="bg-yellow-400 text-white" onClick={handleEditSetup}>
        Edit
      </Button>
      <Button
        className="bg-red-400 text-white"
        onClick={handleDeleteSetup}
      >
        Delete
      </Button>
    </>
  );
}

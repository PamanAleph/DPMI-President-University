"use client";
import Major from "@/models/major";
import Swal from "sweetalert2";
import Button from "../Button";
import React from "react";
import { deleteMajor, updateMajor } from "@/service/api/major";

interface MajorActionsProps {
  majorId: number;
  major: Major;
}

export default function MajorActions({ majorId, major }: MajorActionsProps) {
  const handleEditMajor = async () => {
    let emailsArray: string[] = [];
    if (typeof major.emails === "string") {
      try {
        emailsArray = JSON.parse(major.emails);
      } catch (error) {
        console.error("Error parsing emails:", error);
        emailsArray = []; 
      }
    }

    const emailsString = emailsArray.join(", ");
    const { value: majorData } = await Swal.fire({
      title: "Edit Major",
      html: `<input type="text" id="major-name" class="swal2-input" value="${major.name}" placeholder="Major Name"/>
             <input type="text" id="major-head" class="swal2-input" value="${major.head}" placeholder="Major Head"/>
             <input type="text" id="emails" class="swal2-input" value="${emailsString}" placeholder="Emails (comma separated)"/>`,
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("major-name") as HTMLInputElement
        )?.value;
        const head = (
          document.getElementById("major-head") as HTMLInputElement
        )?.value;
        const emailsInput = (
          document.getElementById("emails") as HTMLInputElement
        )?.value;

        const emails = emailsInput
          .split(",")
          .map(email => email.trim())
          .filter(email => email); 

        if (!name || !head || !emails.length) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-'); 

        return { name, head, emails, slug };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (majorData) {
      try {
        await updateMajor({ ...major, ...majorData });
        Swal.fire("Updated!", "The major has been updated.", "success").then(
          () => {
            window.location.reload();
          }
        );
      } catch (err) {
        console.error("Update error:", err);
        Swal.fire("Error", "Failed to update the major.", "error");
      }
    }
  };

  const handleDeleteMajor = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this major? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMajor(majorId);
          Swal.fire("Deleted!", "The major has been deleted.", "success").then(
            () => {
              window.location.reload();
            }
          );
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Failed to delete the major.", "error");
        }
      }
    });
  };

  return (
    <>
      <Button className="bg-yellow-400 text-white" onClick={handleEditMajor}>
        Edit
      </Button>
      <Button className="bg-red-400 text-white" onClick={handleDeleteMajor}>
        Delete
      </Button>
    </>
  );
}

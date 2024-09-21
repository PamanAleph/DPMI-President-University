"use client"
import React from "react";
import Swal from "sweetalert2";
import { createMajor } from "@/service/api/major";
import Button from "@/components/admin/Button";
import Major from "@/models/major";


export default function CreateMajor() {
  const handleCreateMajor = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Major",
      html: `
        <input id="major_name" class="swal2-input" placeholder="Major Name">
        <input id="major_head" class="swal2-input" placeholder="Major Head">
        <input id="emails" class="swal2-input" placeholder="Emails (comma separated)">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const major_name = (
          document.getElementById("major_name") as HTMLInputElement
        ).value;
        const major_head = (
          document.getElementById("major_head") as HTMLInputElement
        ).value;
        const emails = (
          document.getElementById("emails") as HTMLInputElement
        ).value
          .split(",")
          .map((email) => email.trim());
        const slug = (
            document.getElementById("major_name") as HTMLInputElement
            ).value.toLowerCase().replace(/[^a-z0-9]+/g, "-"
        )

        if (!major_name || !major_head || !emails.length) {
          Swal.showValidationMessage("Please fill all fields");
        }

        return { major_name, major_head, emails, slug };
      },
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
    });

    if (formValues) {
      const { major_name, major_head, emails, slug }: Major = formValues;

      try {
        await createMajor({ major_name, major_head, emails,slug });
        Swal.fire("Success", "Major created successfully!", "success").then(() =>{
            window.location.reload();
        });
      } catch {
        Swal.fire("Error", "Failed to create major!", "error");
      }
    }
  };

  return (
    <Button onClick={handleCreateMajor} className="bg-green-500 text-white">
        Add New Major
    </Button>
  );
}

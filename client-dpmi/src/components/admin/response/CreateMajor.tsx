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
        <input id="name" class="swal2-input" placeholder="Major Name">
        <input id="head" class="swal2-input" placeholder="Major Head">
        <input id="emails" class="swal2-input" placeholder="Emails (comma separated)">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("name") as HTMLInputElement
        ).value;
        const head = (
          document.getElementById("head") as HTMLInputElement
        ).value;
        const emails = (
          document.getElementById("emails") as HTMLInputElement
        ).value
          .split(",")
          .map((email) => email.trim());
        const slug = (
            document.getElementById("name") as HTMLInputElement
            ).value.toLowerCase().replace(/[^a-z0-9]+/g, "-"
        )

        if (!name || !head || !emails.length) {
          Swal.showValidationMessage("Please fill all fields");
        }

        return { name, head, emails, slug };
      },
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
    });

    if (formValues) {
      const { name, head, emails, slug }: Major = formValues;
      console.log(formValues)

      try {
        await createMajor({ name, head, emails,slug });
        Swal.fire("Success", "Major created successfully!", "success").then(() =>{
            window.location.reload();
        });
      } catch (err) {
        console.log("Database insert error:", err);
        throw err;
      }
      
    }
  };

  return (
    <Button onClick={handleCreateMajor} className="bg-green-500 text-white">
        Add New Major
    </Button>
  );
}

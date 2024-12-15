"use client";
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
        <div class="space-y-4">
          <input
            id="name"
            type="text"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Major Name"
          />
          <input
            id="head"
            type="text"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Major Head"
          />
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement)
          .value;
        const head = (document.getElementById("head") as HTMLInputElement)
          .value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        if (!name || !head) {
          Swal.showValidationMessage("Please fill all required fields");
          return null;
        }

        return { name, head, slug };
      },
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
    });

    if (formValues) {
      const { name, head, slug }: Major = formValues;

      try {
        await createMajor({ name, head, slug });
        Swal.fire("Success", "Major created successfully!", "success").then(
          () => {
            window.location.reload();
          }
        );
      } catch (err) {
        console.log("Database insert error:", err);
        Swal.fire(
          "Error",
          "Failed to create major. Please try again.",
          "error"
        );
      }
    }
  };

  return (
    <Button onClick={handleCreateMajor} className="bg-green-500 text-white">
      Add New Major
    </Button>
  );
}

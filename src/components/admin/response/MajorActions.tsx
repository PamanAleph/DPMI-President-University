"use client";
import Major from "@/models/major";
import Swal from "sweetalert2";
import Button from "../Button";
import React, { useState, useEffect, useCallback } from "react";
import { deleteMajor, updateMajor } from "@/service/api/major";
import { fetchUsersByMajor } from "@/service/api/users";
import { getAccessToken } from "@/utils/sessionStorage";

interface MajorActionsProps {
  majorId: number;
  major: Major;
}

export default function MajorActions({ majorId, major }: MajorActionsProps) {
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = getAccessToken();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await fetchUsersByMajor(majorId, accessToken as string);
      const options = users.map((user: { email: string }) => user.email);
      setUserOptions(options);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [majorId, accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditMajor = async () => {
    const emailsArray = Array.isArray(major.emails) ? major.emails : []; // Ensure emailsArray is always an array

    const { value: majorData } = await Swal.fire({
      title: "Edit Major",
      html: `
        <div class="space-y-4">
          <input
            type="text"
            id="major-name"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value="${major.name}"
            placeholder="Major Name"
          />
          <input
            type="text"
            id="major-head"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value="${major.head}"
            placeholder="Major Head"
          />
          <label for="email-select" class="block text-sm font-medium text-gray-700">
            Select New Email
          </label>
          <select
            id="email-select"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            ${
              loading
                ? `<option disabled>Loading users...</option>`
                : userOptions.length > 0
                ? userOptions
                    .map(
                      (email) =>
                        `<option value="${email}">${
                          emailsArray.includes(email) ? "(Current) " : ""
                        }${email}</option>`
                    )
                    .join("")
                : `<option disabled>No users available for this major</option>`
            }
          </select>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("major-name") as HTMLInputElement)
          ?.value;
        const head = (document.getElementById("major-head") as HTMLInputElement)
          ?.value;
        const selectedEmail = (document.getElementById(
          "email-select"
        ) as HTMLSelectElement)?.value;

        if (!name || !head || !selectedEmail) {
          Swal.showValidationMessage("Please fill all fields");
          return null;
        }

        const slug = name.toLowerCase().replace(/\s+/g, "-");

        return { name, head, emails: [selectedEmail], slug };
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
    <div className="flex gap-2">
      <Button className="bg-yellow-400 text-white" onClick={handleEditMajor}>
        Edit
      </Button>
      <Button className="bg-red-400 text-white" onClick={handleDeleteMajor}>
        Delete
      </Button>
    </div>
  );
}

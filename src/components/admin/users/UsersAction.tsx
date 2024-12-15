"use client";
import React from "react";
import Button from "../Button";
import Users from "@/models/users";
import Swal from "sweetalert2";
import { UpdateUser, DeleteUser } from "@/service/api/users";
import { useRouter } from "next/navigation";

interface UsersActionProps {
  userId: number;
  user: Users;
  majors: { value: number; label: string }[];
}

export default function UsersAction({ userId, user, majors }: UsersActionProps) {
  const router = useRouter();

  // Parse session data
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");

  const editUser = async () => {
    const { value: formData } = await Swal.fire({
      title: "Edit User",
      html: `
        <input type="text" id="username" class="swal2-input" value="${user.username}" placeholder="Username"/>
        <input type="password" id="password" class="swal2-input" placeholder="New Password (optional)"/>
        <select id="major" class="swal2-input">
          <option value="">Select Major</option>
          ${majors
            .map(
              (major) =>
                `<option value="${major.value}" ${
                  major.value === user.major_id ? "selected" : ""
                }>${major.label}</option>`
            )
            .join("")}
        </select>
        <div>
          <label for="isAdmin" style="display: inline-block; margin-top: 10px;">
            <input type="checkbox" id="isAdmin" ${user.is_admin ? "checked" : ""} />
            Is Admin
          </label>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const username = (document.getElementById("username") as HTMLInputElement)?.value;
        const password = (document.getElementById("password") as HTMLInputElement)?.value;
        const major = parseInt((document.getElementById("major") as HTMLSelectElement)?.value, 10);
        const isAdmin = (document.getElementById("isAdmin") as HTMLInputElement)?.checked;

        if (!username || isNaN(major)) {
          Swal.showValidationMessage("Please fill all required fields");
          return null;
        }

        return {
          username,
          password: password || null,
          major_id: major,
          is_admin: isAdmin,
        };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (formData) {
      try {
        Swal.fire({
          title: "Updating...",
          text: "Please wait while the user is being updated.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await UpdateUser(
          userId,
          {
            ...user,
            username: formData.username,
            major_id: formData.major_id,
            is_admin: formData.is_admin,
          },
          sessionData.accessToken
        );

        Swal.close();

        // If is_admin changes from true to false and matches session user, remove session and redirect
        if (sessionData.is_admin && sessionData.email === user.email && !formData.is_admin) {
          sessionStorage.removeItem("user");
          router.push("/auth/login");
        } else {
          Swal.fire("Updated!", "The user has been updated.", "success").then(() => {
            window.location.reload();
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire("Error", `Failed to update the user: ${errorMessage}`, "error");
      }
    }
  };

  const deleteUser = async () => {
    // Prevent self-deletion
    if (sessionData.email === user.email) {
      Swal.fire(
        "Action Denied",
        "You cannot delete your own account.",
        "warning"
      );
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while the user is being deleted.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await DeleteUser(userId, sessionData.accessToken);

        Swal.close();
        Swal.fire("Deleted!", "The user has been deleted.", "success").then(() => {
          window.location.reload();
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        Swal.fire("Error", `Failed to delete the user: ${errorMessage}`, "error");
      }
    }
  };

  return (
    <section className="flex gap-2 justify-center items-center">
      <Button
        className="bg-yellow-400 text-white hover:bg-yellow-300 duration-300"
        onClick={editUser}
      >
        Edit
      </Button>
      <Button
        className="bg-red-500 text-white hover:bg-red-400 duration-300"
        onClick={deleteUser}
      >
        Delete
      </Button>
    </section>
  );
}

"use client";

import Swal from "sweetalert2";
import { fetchMajor } from "@/service/api/major";
import { getAccessToken } from "@/utils/sessionStorage";
import Button from "../Button";
import { AdminRegister } from "@/service/api/auth";

export default function AddUserModal() {
  const handleAddUser = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      Swal.fire("Unauthorized", "Access token not found.", "error");
      return;
    }

    // Fetch the list of majors
    const majorResponse = await fetchMajor();
    const majorOptions = majorResponse.map((major: { id: number; name: string }) => ({
      id: major.id,
      name: major.name,
    }));

    const { value: formValues } = await Swal.fire({
      title: "Register User",
      html: `
        <input type="email" id="email" class="swal2-input" placeholder="Email" />
        <input type="password" id="password" class="swal2-input" placeholder="Password" />
        <input type="text" id="username" class="swal2-input" placeholder="Username" />
        <select id="major-select" class="swal2-input">
          <option value="" disabled selected>Select Major</option>
          ${majorOptions
            .map((major) => `<option value="${major.id}">${major.name}</option>`)
            .join("")}
        </select>
        <div class="swal2-checkbox">
          <input type="checkbox" id="is-admin" />
          <label for="is-admin">Admin?</label>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const email = (document.getElementById("email") as HTMLInputElement)?.value;
        const password = (document.getElementById("password") as HTMLInputElement)?.value;
        const username = (document.getElementById("username") as HTMLInputElement)?.value;
        const major_id = (document.getElementById("major-select") as HTMLSelectElement)?.value;
        const is_admin = (document.getElementById("is-admin") as HTMLInputElement)?.checked;

        if (!major_id || !email || !password || !username) {
          Swal.showValidationMessage("Please fill out all fields.");
          return null;
        }

        return {
          email,
          password,
          username,
          is_admin,
          major_id: parseInt(major_id, 10),
        };
      },
      showCancelButton: true,
      confirmButtonText: "Register",
      cancelButtonText: "Cancel",
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Registering...",
          text: "Please wait while the user is being registered.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // API call to register the user
        await AdminRegister( formValues);

        Swal.close();
        Swal.fire("Success!", "The user has been registered.", "success").then(() => {
          window.location.reload(); // Refresh the page or update the UI
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        Swal.fire("Error", `Failed to register the user: ${errorMessage}`, "error");
      }
    }
  };

  return (
    <Button className="bg-blue-500 text-white" onClick={handleAddUser}>
      Add User
    </Button>
  );
}

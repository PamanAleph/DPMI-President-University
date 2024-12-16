"use client";
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Button from "../Button";
import EditMajorModal from "./EditMajorModal";
import { getAccessToken } from "@/utils/sessionStorage";
import { fetchUsersByMajor } from "@/service/api/users";
import { deleteMajor, updateMajor } from "@/service/api/major";
import Major from "@/models/major";
import Users from "@/models/users";

interface MajorActionsProps {
  majorId: number;
  major: Major;
}

export default function MajorActions({ majorId, major }: MajorActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const accessToken = getAccessToken();

  const fetchUsers = useCallback(async () => {
    try {
      const users = await fetchUsersByMajor(majorId, accessToken as string);
      setUserOptions(users.map((user: Users) => user.email));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [majorId, accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveMajor = async (data: { name: string; head: string; emails: string[] }) => {
    try {
      await updateMajor({ ...major, ...data });
      Swal.fire("Success", "Major updated successfully!", "success");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Failed to update major.", "error");
    }
  };

  const handleDeleteMajor = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMajor(majorId);
          Swal.fire("Deleted!", "Major has been deleted successfully.", "success");
          window.location.reload();
        } catch (error) {
          console.error("Delete failed:", error);
          Swal.fire("Error", "Failed to delete major.", "error");
        }
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => setShowModal(true)} className="bg-yellow-400 text-white">
        Edit
      </Button>

      <Button onClick={handleDeleteMajor} className="bg-red-400 text-white">
        Delete
      </Button>

      {showModal && (
        <EditMajorModal
          major={major}
          userOptions={userOptions}
          onClose={() => setShowModal(false)}
          onSave={handleSaveMajor}
          onDelete={handleDeleteMajor}
        />
      )}
    </div>
  );
}

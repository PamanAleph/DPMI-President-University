import React, { useState } from "react";
import Swal from "sweetalert2";
import CustomEmailSelector from "./EmailSelector";
import Major from "@/models/major";

interface EditMajorModalProps {
  major: Major
  userOptions: string[];
  onClose: () => void;
  onSave: (data: { name: string; head: string; emails: string[] }) => void;
  onDelete: () => void;
}

export default function EditMajorModal({
  major,
  userOptions,
  onClose,
  onSave,
  onDelete,
}: EditMajorModalProps) {
  const [name, setName] = useState(major.name);
  const [head, setHead] = useState(major.head);
  const [emails, setEmails] = useState<string[]>(major.emails || []);

  const handleSave = () => {
    if (!name || !head || emails.length === 0) {
      Swal.fire("Error", "All fields are required, including emails.", "error");
      return;
    }

    onSave({ name, head, emails });
    Swal.fire("Success", "Major updated successfully!", "success");
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        Swal.fire("Deleted!", "The major has been deleted.", "success");
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-semibold mb-4">Edit Major</h2>

        <label className="block text-sm font-medium mb-1">Major Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block text-sm font-medium mb-1">Major Head</label>
        <input
          type="text"
          value={head}
          onChange={(e) => setHead(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block text-sm font-medium mb-1">Emails</label>
        <CustomEmailSelector
          initialEmails={emails}
          userOptions={userOptions}
          onEmailsChange={(updatedEmails) => setEmails(updatedEmails)}
        />

        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

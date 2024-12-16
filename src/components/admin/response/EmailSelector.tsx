"use client"
import React, { useState } from "react";

interface CustomEmailSelectorProps {
  initialEmails: string[];
  userOptions: string[];
  onEmailsChange: (emails: string[]) => void;
}

export default function CustomEmailSelector({
  initialEmails,
  userOptions,
  onEmailsChange,
}: CustomEmailSelectorProps) {
  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [inputValue, setInputValue] = useState("");

  const handleAddEmail = () => {
    if (!inputValue.trim()) return; // Ignore empty input
    if (!emails.includes(inputValue)) {
      const updatedEmails = [...emails, inputValue.trim()];
      setEmails(updatedEmails);
      onEmailsChange(updatedEmails); // Update parent state
    }
    setInputValue(""); // Reset input
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove);
    setEmails(updatedEmails);
    onEmailsChange(updatedEmails); // Update parent state
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter email"
          className="border px-2 py-1 rounded w-full"
          list="userOptions"
        />
        <button
          onClick={handleAddEmail}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      <datalist id="userOptions">
        {userOptions
          .filter((email) => !emails.includes(email))
          .map((email) => (
            <option key={email} value={email} />
          ))}
      </datalist>

      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email}
            className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
          >
            <span>{email}</span>
            <button
              onClick={() => handleRemoveEmail(email)}
              className="text-red-600 hover:text-red-800"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

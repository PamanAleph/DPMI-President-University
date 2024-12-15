import React from "react";

export default function FormExpired() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-6">
      <div className="max-w-md text-center bg-white shadow-xl rounded-lg p-10 space-y-6">
        <h2 className="text-3xl font-bold text-red-600">Form Expired</h2>
        <p className="text-lg">
          We&apos;re sorry, but this form is no longer available. The submission
          period has ended, and responses can no longer be accepted.
        </p>
        <p className="text-sm text-gray-500">
          If you have any questions or need further assistance, please contact
          the administrator.
        </p>
      </div>
    </div>
  );
}

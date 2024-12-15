import React from "react";

export default function FormNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-6">
      <div className="max-w-md text-center bg-white shadow-xl rounded-lg p-10 space-y-6">
        <h2 className="text-3xl font-bold text-red-500">Form Not Found</h2>
        <p className="text-lg">
          Sorry, we couldn&apos;t locate the form you&apos;re looking for. It
          may have been removed or the link is incorrect.
        </p>
        <p className="text-sm text-gray-500">
          Please check the link or contact the administrator for assistance.
        </p>
      </div>
    </div>
  );
}

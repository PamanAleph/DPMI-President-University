import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Skeleton for the title */}
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>

      {/* Skeleton for the info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Skeleton for the table */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
            <thead className="bg-gray-200">
              <tr className="text-center">
                {Array(3)
                  .fill("")
                  .map((_, index) => (
                    <th
                      key={index}
                      className="py-2 px-4 text-gray-700 border border-gray-300"
                    >
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill("")
                .map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {Array(3)
                      .fill("")
                      .map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="py-2 px-4 text-gray-500 border border-gray-300"
                        >
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

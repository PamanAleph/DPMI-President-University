import Setup from "@/models/setup";
import Link from "next/link";
import React from "react";
import Button from "./Button";
// import SetupActions from "./SetupActions";

interface SetupTableProps {
  setups: Setup[];
}

export default function SetupTable({ setups }: SetupTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              No
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Setup Name
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Semester
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Major
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Start Date
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              End Date
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-center">
          {setups.map((setup, index) => (
            <tr key={setup.id}>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {index + 1}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[150px]">
                {setup.name}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[150px]">
                {setup.semester}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[200px]">
  {setup.major_name.map((name, index) => (
    <div key={index}>
      {name}{index < setup.major_name.length - 1 ? ',' : ''}
    </div>
  ))}
</td>

              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[200px]">
                {new Date(setup.start_date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[200px]">
                {new Date(setup.end_date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 flex gap-2 items-center justify-center">
                <Link href={`/admin/response/${setup.slug}`}>
                  <Button className="text-white bg-green-600">View</Button>
                </Link>
                {/* <SetupActions setupId={setup.id} major={setup} /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

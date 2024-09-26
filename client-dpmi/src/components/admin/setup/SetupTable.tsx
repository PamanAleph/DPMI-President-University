import Setup from "@/models/setup";
import Link from "next/link";
import React from "react";
import Button from "../Button";
import SetupActions from "./SetupActions";


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
              Create At
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
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[200px]">
                {new Date(setup.create_at).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-center">
                <div className="flex gap-2 justify-center items-center">
                  <Link href={`setup/${setup.slug}`}>
                    <Button className="text-white bg-green-600">View</Button>
                  </Link>
                  <SetupActions setupId={setup.id} setup={setup}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

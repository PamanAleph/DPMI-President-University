import Major from "@/models/major";
import Link from "next/link";
import React from "react";
import Button from "../Button";
import MajorActions from "./MajorActions";

interface MajorTableProps {
  majors: Major[];
}

export default function MajorTable({ majors }: MajorTableProps) {
    const sortedMajors = [...majors].sort((a, b) => 
        a.name.localeCompare(b.name)
      );

  const formatEmails = (emails: string | string[] | null) => {
    if (!emails) return "N/A";

    if (Array.isArray(emails)) {
      return emails.join(", ");
    }

    try {
      const parsedEmails = JSON.parse(emails);
      if (Array.isArray(parsedEmails)) {
        return parsedEmails.join(", ");
      }
    } catch {
      return emails;
    }

    return emails;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              No
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Major Name
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Major Head
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Emails
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-center">
        {sortedMajors.map((major, index) => (
            <tr key={major.id}>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {index + 1}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[150px]">
                {major.name}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[150px]">
                {major.head || "N/A"}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 max-w-[200px]">
                {formatEmails(major.emails) || "N/A"}
              </td>
              <td className="whitespace-nowrap px-4 py-2 flex gap-2 items-center justify-center">
                <Link href={`response/${major.slug}`}>
                  <Button className="text-white bg-green-600">View</Button>
                </Link>
                <MajorActions majorId={major.id} major={major} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

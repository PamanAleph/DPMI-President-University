"use client"
import React, { useEffect, useState } from "react";
import Users from "@/models/users";
import UsersAction from "./UsersAction";
import { fetchMajor } from "@/service/api/major";

interface UsersTableProps {
  users: Users[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [majors, setMajors] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    const getMajors = async () => {
      try {
        const majorsData = await fetchMajor();
        const formattedMajors = majorsData.map((major: { id: number; name: string }) => ({
          value: major.id,
          label: major.name,
        }));
        setMajors(formattedMajors);
      } catch (error) {
        console.error("Failed to fetch majors:", error);
      }
    };

    getMajors();
  }, []); 
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full table-auto divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              No
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Username
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Email
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Major
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Role
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {index + 1}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {user.username}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {user.major_name || "-"}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {user.is_admin ? "Admin" : "User"}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <UsersAction user={user} userId={user.id} majors={majors} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

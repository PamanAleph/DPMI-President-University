"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/admin/Button";
import Title from "@/components/admin/Title";
import UsersTable from "@/components/admin/users/UsersTable";
import { GetUserList } from "@/service/api/users";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = sessionStorage.getItem("user");
        const accessToken = userData ? JSON.parse(userData).accessToken : null;

        if (!accessToken) {
          throw new Error("Access token not found in sessionStorage.");
        }

        const fetchedUsers = await GetUserList({ accessToken });
        setUsers(fetchedUsers);
      } catch (err) {
        if (err instanceof Error) {
          // Narrow the error to have access to `message`
          setError(err.message);
        } else {
          // Handle other unknown errors
          setError("An unknown error occurred.");
        }
        console.error("Error fetching user list:", err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="space-y-4">
      <Title>User List</Title>
      <div className="justify-end flex">
        <Button className="bg-green-500 text-white">Add User</Button>
      </div>
      <UsersTable users={users} />
    </section>
  );
}

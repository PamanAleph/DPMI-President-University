"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/admin/Button";
import Title from "@/components/admin/Title";
import UsersTable from "@/components/admin/users/UsersTable";
import { GetUserList } from "@/service/api/users";
import { getAccessToken } from "@/utils/sessionStorage";

export default function ClientUserPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setError("Unauthorized: Access token not found.");
        return;
      }

      try {
        const fetchedUsers = await GetUserList(accessToken);
        setUsers(fetchedUsers);
      } catch (err) {
        setError("Error fetching user list");
        console.error("Error fetching users:", err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
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

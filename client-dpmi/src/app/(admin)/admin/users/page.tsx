import Button from "@/components/admin/Button";
import Title from "@/components/admin/Title";
import UsersTable from "@/components/admin/users/UsersTable";
import { GetUserList } from "@/service/api/users";
import React from "react";

export default async function page() {
  const users = await GetUserList();

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

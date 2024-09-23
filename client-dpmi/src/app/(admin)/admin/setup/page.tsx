import Button from "@/components/admin/Button";
import SetupTable from "@/components/admin/SetupTable";
import { fetchSetup } from "@/service/api/setup";
import React from "react";

export default async function Page() {
  const setup = await fetchSetup();
  return (
    <section className="min-h-screen">
      <Button className="bg-green-500 text-white">Add New Major</Button>
      <SetupTable setups={setup} />
    </section>
  );
}

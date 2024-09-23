import Button from "@/components/admin/Button";
import SetupTable from "@/components/admin/SetupTable";
import { fetchSetup } from "@/service/api/setup";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const setup = await fetchSetup();
  return (
    <section className="space-y-4">
      <div className="justify-end flex">
        <Link  href="setup/create">
          <Button className="bg-green-500 text-white">Add New Setup</Button>
        </Link>
      </div>
      <SetupTable setups={setup} />
    </section>
  );
}

import DashboardContent from "@/components/user/DashboardContent";
import { DashobardContextProvider } from "@/components/user/DashboardContext";
import DashboardSidebar from "@/components/user/DashboardSidebar";
import ToggleButton from "@/components/user/ToggleButton";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashobardContextProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content */}

        <DashboardContent>{children}</DashboardContent>

        {/* Toggle button */}
        <ToggleButton />
      </div>
    </DashobardContextProvider>
  );
}

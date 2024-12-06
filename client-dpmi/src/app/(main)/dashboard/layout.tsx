"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashobardContextProvider } from "./_components/DashboardContext";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardContent from "./_components/DashboardContent";
import ToggleButton from "./_components/ToggleButton";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
    } else {
      const user = JSON.parse(storedUser);
      if (!user.accessToken) {
        router.push("/");
      }
      if (user.is_admin) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

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

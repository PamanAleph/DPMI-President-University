"use client";
import { useDashboardContext } from "./DashboardContext";

export default function DashboardContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const dashboardContext = useDashboardContext();

    return (
        <main
            className={`flex-1 overflow-x-auto overflow-y-auto p-4 transition-transform duration-300 ease-in-out ${dashboardContext.isMenuOpen ? "ml-0 md:ml-64" : "ml-0"}`}
        >
            {children}
        </main>
    );
}

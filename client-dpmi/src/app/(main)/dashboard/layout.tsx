import { DashobardContextProvider } from "./_components/DashboardContext";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardContent from "./_components/DashboardContent";
import ToggleButton from "./_components/ToggleButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // if (session?.user.role_id === 2 || session?.user.role_id === 8) {
    //     return redirect("/");
    // }

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

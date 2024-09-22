import Sidebar from "@/components/admin/Sidebar";
import Image from "next/image";
import PULOGO from "@/assets/pu_logo.jpg";
import { AdminDashboardContextProvider } from "@/context/AdminDashboardContext"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // if (session?.user.role_id === 2 || session?.user.role_id === 8) {
    //     return redirect("/");
    // }

    return (
        <AdminDashboardContextProvider>
            <div className="bg-[#FBFBFB] scroll-smooth text-black">

                {/* Sidebar Desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                        <div className="flex h-24 shrink-0 items-center justify-center">
                            <Image
                                className="h-16 w-auto"
                                src={PULOGO}
                                width={200}
                                height={200}
                                alt="Your Company"
                            />
                        </div>

                        <Sidebar/>
                    </div>
                </div>

                {/*Content*/}
                <div className="lg:pl-72">
                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                    </main>
                </div>
            </div>
        </AdminDashboardContextProvider>
    );
}

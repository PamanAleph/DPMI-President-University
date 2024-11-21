import Navbar from "@/components/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FBFBFB] scroll-smooth text-black">
      <Navbar />
      {children}
    </div>
  );
}

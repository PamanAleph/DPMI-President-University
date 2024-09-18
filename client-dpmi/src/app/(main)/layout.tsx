export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FBFBFB] scroll-smooth text-black">{children}</div>
  );
}

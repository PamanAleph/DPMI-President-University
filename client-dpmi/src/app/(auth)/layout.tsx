export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#FBFBFB]">{children}</div>;
}

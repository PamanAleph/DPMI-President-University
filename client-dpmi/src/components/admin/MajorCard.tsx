import Link from "next/link";

interface MajorCardProps {
  name: string;
}

export default function MajorCard({ name }: MajorCardProps) {
  if (!name) {
    return <p>Error: Name is missing.</p>;
  }

  return (
    <Link
      href={`response/${name.toLowerCase().replace(/\s+/g, "-")}`}
      className="bg-white rounded-xl shadow-lg p-6 text-center w-full h-full flex items-center justify-center transition-transform transform hover:scale-105 duration-300 ease-in-out"
    >
      <p className="text-2xl font-semibold text-gray-900">{name}</p>
    </Link>
  );
}

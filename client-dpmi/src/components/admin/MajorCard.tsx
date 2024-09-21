import Link from "next/link";

interface MajorCardProps {
  major: {
    id?: number;
    major_name: string;
  };
}

export default function MajorCard({ major }: MajorCardProps) {
  const slug = major.major_name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={`/admin/response/${slug}`}
      className="bg-white rounded-xl shadow-lg p-6 text-center w-full h-full flex items-center justify-center transition-transform transform hover:scale-105 duration-300 ease-in-out"
    >
      <p className="text-2xl font-semibold text-gray-900">{major.major_name}</p>
    </Link>
  );
}

import MajorCard from "@/components/admin/MajorCard";
import { fetchMajor } from "@/service/api/major";
import CreateMajor from "./_components/CreateMajor";

export default async function page() {
  const majors = await fetchMajor();

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <CreateMajor/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-screen">
        {majors.map((major) => (
          <MajorCard key={major.id} major={major} />
        ))}
      </div>
    </section>
  );
}

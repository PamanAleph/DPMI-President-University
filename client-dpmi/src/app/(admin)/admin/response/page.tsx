import MajorCard from "@/components/admin/MajorCard";
import { fetchMajor } from "@/service/api/major";


export default async function page() {
  const majors = await fetchMajor();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-screen">
            {majors.map((major) => (
                <MajorCard key={major.id} name={major.name} />
            ))}
        </section>
  )
}

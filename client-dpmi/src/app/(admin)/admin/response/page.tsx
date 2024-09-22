import { fetchMajor } from "@/service/api/major";
import CreateMajor from "./_components/CreateMajor";
import MajorTable from "@/components/admin/MajorTable";

export default async function page() {
  const majors = await fetchMajor();

  return (
    <section className="space-y-4 h-screen bg-[#FBFBFB]">
      <div className="flex justify-end">
        <CreateMajor />
      </div>
      <MajorTable majors={majors} />
    </section>
  );
}

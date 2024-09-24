import { fetchMajor } from "@/service/api/major";
import CreateMajor from "@/components/admin/response/CreateMajor";
import MajorTable from "@/components/admin/response/MajorTable";

export default async function page() {
  const majors = await fetchMajor();

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <CreateMajor />
      </div>
      <MajorTable majors={majors} />
    </section>
  );
}

import { fetchMajor } from "@/service/api/major";
import CreateMajor from "@/components/admin/response/CreateMajor";
import MajorTable from "@/components/admin/response/MajorTable";
import Title from "@/components/admin/Title";

export default async function page() {
  const majors = await fetchMajor();
  return (
    <section className="space-y-4">
      <Title>Response Page</Title>
      <div className="flex justify-end">
        <CreateMajor />
      </div>
      <MajorTable majors={majors} />
    </section>
  );
}

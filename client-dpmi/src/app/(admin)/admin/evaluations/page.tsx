import EvaluationTable from "@/components/admin/evaluations/EvaluationTable";
import Title from "@/components/admin/Title";
import { fetchEvaluations } from "@/service/api/evaluation";
import React from "react";

export default async function page() {
  const evaluation = await fetchEvaluations();

  return (
    <section className="space-y-4">
      <Title>Evaluations Page</Title>
      <EvaluationTable evaluations={evaluation} />
    </section>
  );
}

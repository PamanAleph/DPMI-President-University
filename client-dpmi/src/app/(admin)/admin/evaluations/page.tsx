import Button from "@/components/admin/Button";
import EvaluationTable from "@/components/admin/evaluations/EvaluationTable";
import Title from "@/components/admin/Title";
import { fetchEvaluations } from "@/service/api/evaluation";
import Link from "next/link";
import React from "react";

export default async function page() {
  const evaluation = await fetchEvaluations();

  if (!evaluation || evaluation.length === 0) {
    return (
      <section className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4 text-gray-600">
            Data Evaluasi Belum Tersedia
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Silakan tambahkan data evaluasi terlebih dahulu untuk melihat daftar
            evaluasi.
          </p>
          <Link href={"/admin/setup"}>
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tambah Data Evaluasi
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <Title>Evaluations Page</Title>
      <EvaluationTable evaluations={evaluation} />
    </section>
  );
}

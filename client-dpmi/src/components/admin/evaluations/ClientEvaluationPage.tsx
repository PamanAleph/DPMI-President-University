"use client";

import Button from "@/components/admin/Button";
import EvaluationTable from "@/components/admin/evaluations/EvaluationTable";
import Title from "@/components/admin/Title";
import Evaluation from "@/models/evaluation";
import { fetchEvaluations } from "@/service/api/evaluation";
import { getAccessToken } from "@/utils/sessionStorage";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ClientEvaluationPage() {
  const [evaluations, setEvaluations]= useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setError("Unauthorized: Access token not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchEvaluations(accessToken);
        setEvaluations(data);
      } catch (err) {
        console.error("Error fetching evaluations:", err);
        setError("Failed to fetch evaluations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="container">
        <p className="text-center text-gray-500">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4 text-red-600">{error}</h2>
          <p className="text-sm text-gray-500 mb-8">
            Please refresh the page or contact support if the issue persists.
          </p>
        </div>
      </section>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return (
      <section className="container">
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
    <section className="space-y-10 container">
      <Title>Evaluations Page</Title>
      <EvaluationTable evaluations={evaluations} />
    </section>
  );
}

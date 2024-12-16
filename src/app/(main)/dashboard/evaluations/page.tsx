"use client";
import React, { useEffect, useState } from "react";
import { fetchEvaluationByMajorId } from "@/service/api/evaluation";
import { EvaluationMajor } from "@/models/EvaluationMajor";
import Link from "next/link";
import { encryptId } from "@/utils/crypto";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<EvaluationMajor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await fetchEvaluationByMajorId();
        if (isMounted) {
          setEvaluations(data);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch evaluations.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Evaluations</h1>

      {/* Tabel Responsif */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Setup Name
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Emails
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Semester
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((item, idx) => (
              <tr
                key={item.evaluation_id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {idx + 1}.
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {item.setup_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  <ul className="list-disc list-inside">
                    {item.emails.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {item.semester}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {new Date(item.end_date).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center flex justify-center items-center gap-2">
                  {new Date(item.end_date) > new Date() ? (
                    <Link href={`/form/${encryptId(item.evaluation_id)}`} className="bg-green-500 duration-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Check
                    </Link>
                  ) : (
                    <button
                      className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                      disabled
                    >
                      Expired
                    </button>
                  )}
                  <Link href={`evaluations/${item.evaluation_id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

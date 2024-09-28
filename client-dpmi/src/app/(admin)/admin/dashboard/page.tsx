import StatisticCard from "@/components/admin/StatisticCard";
import { fetchEvaluations } from "@/service/api/evaluation";
import { fetchMajor } from "@/service/api/major";
import { fetchSetup } from "@/service/api/setup";
import React from "react";

export default async function page() {
  try {
    const [majors, evaluations, setups] = await Promise.all([
      fetchMajor(),
      fetchEvaluations(),
      fetchSetup(),
    ]);

    const totalMajors = majors.length;
    const totalEvaluations = evaluations.length;
    const totalSetups = setups.length;

    const recentSetups = setups.slice(0, 3);
    const recentEvaluations = evaluations.slice(0, 3);

    const statistickData = [
      { label: "Majors", value: totalMajors },
      { label: "Evaluations", value: totalEvaluations },
      { label: "Setups", value: totalSetups },
    ];

    return (
      <section>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statistickData.map((stat, index) => (
            <StatisticCard
              key={index}
              title={`Total ${stat.label}`}
              value={stat.value}
            />
          ))}
        </div>

        {/* Recent Setups */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Setups
          </h2>
          <ul className="space-y-6">
            {recentSetups.map((setup, index) => (
              <li
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="font-semibold text-lg text-gray-700">
                  {setup.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">ID: {setup.id}</p>
                <p className="text-sm text-gray-500">
                  Created At: {new Date(setup.create_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Evaluations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Evaluations
          </h2>
          <ul className="space-y-6">
            {recentEvaluations.map((evaluation, index) => (
              <li
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="font-semibold text-lg text-gray-700">
                  Evaluation ID: {evaluation.id}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Related Setup: {evaluation.setup_id}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Related Major: {evaluation.major_names.join(", ")}
                </p>{" "}
                <p className="text-sm text-gray-500 mt-1">
                  End Date: {new Date(evaluation.end_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  } catch {
    return (
      <section className="p-6">
        <p className="text-red-500">Failed to fetch data</p>
      </section>
    );
  }
}

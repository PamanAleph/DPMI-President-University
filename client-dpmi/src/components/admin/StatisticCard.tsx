import React from 'react';

interface StatisticCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode; // optional icon
  color?: string; // optional color for background
}

export default function StatisticCard({ title, value, icon, color = 'blue' }: StatisticCardProps) {
  return (
    <div
      className={`bg-${color}-500 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300 ease-in-out`}
    >
      {/* Icon Section */}
      {icon && (
        <div className={`p-3 bg-white rounded-full text-${color}-500`}>
          {icon}
        </div>
      )}

      <div className="flex-1">
        <h4 className="text-xl font-semibold text-white mb-1">{title}</h4>
        <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

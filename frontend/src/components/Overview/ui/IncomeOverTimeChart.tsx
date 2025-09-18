import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const labels = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const dailyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const weeklyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const yearlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const chartData = (data: number[]) => ({
  labels,
  datasets: [
    {
      data,
      backgroundColor: "rgba(128, 90, 213, 0.7)", // #805AD5 with opacity
      borderRadius: 8,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
      borderSkipped: false,
    },
  ],
});

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "#fff",
      titleColor: "#805AD5",
      bodyColor: "#805AD5",
      borderColor: "#E9D8FD",
      borderWidth: 1,
      padding: 8,
      displayColors: false,
    },
  },
  layout: {
    padding: { top: 10, right: 10, left: 10, bottom: 0 },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#A0AEC0",
        font: { size: 14, family: "Inter, sans-serif" },
        padding: 6,
      },
    },
    y: {
      min: 0,
      max: 80,
      grid: {
        color: "#F3F4F6",
        lineWidth: 1,
        borderDash: [4, 4],
        drawBorder: false,
      },
      ticks: {
        color: "#CBD5E1",
        font: { size: 13, family: "Inter, sans-serif" },
        stepSize: 20,
        padding: 8,
      },
    },
  },
} as ChartOptions<"bar">;

export default function IncomeOverTimeChart() {
  const [mode, setMode] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    "daily"
  );
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-4 w-full shadow-sm"
      style={{ height: 430, minHeight: 430, maxHeight: 430 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold pl-4">Income Over Time</div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition border ${
              mode === "daily"
                ? "bg-violet-100 text-violet-700 border-violet-200"
                : "bg-white text-violet-400 border-transparent hover:bg-violet-50"
            }`}
            onClick={() => setMode("daily")}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition border ${
              mode === "weekly"
                ? "bg-violet-100 text-violet-700 border-violet-200"
                : "bg-white text-violet-400 border-transparent hover:bg-violet-50"
            }`}
            onClick={() => setMode("weekly")}
          >
            Weekly
          </button>

          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition border ${
              mode === "monthly"
                ? "bg-violet-100 text-violet-700 border-violet-200"
                : "bg-white text-violet-400 border-transparent hover:bg-violet-50"
            }`}
            onClick={() => setMode("monthly")}
          >
            Monthly
          </button>

          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition border ${
              mode === "yearly"
                ? "bg-violet-100 text-violet-700 border-violet-200"
                : "bg-white text-violet-400 border-transparent hover:bg-violet-50"
            }`}
            onClick={() => setMode("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="border-b border-gray-100 mb-2" />
      <div style={{ height: 340 }}>
        <Bar
          data={chartData(
            mode === "daily"
              ? dailyData
              : mode === "weekly"
              ? weeklyData
              : mode === "monthly"
              ? monthlyData
              : yearlyData
          )}
          options={options}
        />
      </div>
    </div>
  );
}

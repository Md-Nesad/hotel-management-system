import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: true },
    datalabels: { display: false },
  },
  layout: { padding: 0 },
  scales: {
    y: {
      beginAtZero: true,
      max: 50,
      ticks: { color: "#64748b", font: { size: 14 }, stepSize: 10 },
      grid: { color: "#f1f5f9" },
    },
    x: {
      ticks: { color: "#64748b", font: { size: 14 } },
      grid: { display: false },
    },
  },
  elements: {
    line: { borderWidth: 2 },
    point: { radius: 0 },
  },
};

export default function BookingTrendChart() {
  const [bookingTrendData, setBookingTrendData] = useState<any>(null);

  useEffect(() => {
    fetch("https://backend.bahamaslrb.com/api/bookings/all")
      .then((res) => res.json())
      .then((data) => {
        const monthlyCount = new Array(12).fill(0);

        data.forEach((booking: any) => {
          const month = new Date(booking.createdAt).getMonth();
          monthlyCount[month] += 1;
        });

        const chartData = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Bookings",
              data: monthlyCount,
              borderColor: "#845ADF",
              backgroundColor: "rgba(132, 90, 223, 0.1)",
              fill: false,
              borderWidth: 1.5,
            },
          ],
        };

        setBookingTrendData(chartData);
      });
  }, []);

  if (!bookingTrendData) return <p className="p-4">Loading...</p>;

  return (
    <div
      className="bg-white p-0 rounded-xl border border-gray-200 w-full h-[370px]"
      style={{ boxShadow: "none" }}
    >
      <h3 className="text-[22px] font-semibold text-gray-600 px-5 pt-3">
        Booking Trend
      </h3>
      <div className="border-b border-gray-200 w-[97%] mt-2" />
      <div className="w-[97%] pt-9 pl-4" style={{ height: 300 }}>
        <Line data={bookingTrendData} options={options} />
      </div>
    </div>
  );
}

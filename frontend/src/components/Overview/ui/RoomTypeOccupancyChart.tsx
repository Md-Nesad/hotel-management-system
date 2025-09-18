import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";

const COLORS = ["#FF8C00", "#FF00FF", "#8A2BE2"];
const RADIAN = Math.PI / 180;

export default function DonutChartWithLabels() {
  const [roomData, setRoomData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    fetch("https://backend.bahamaslrb.com/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        const allowedTypes = ["vip", "delux", "comfort"]; // lower case
        const counts: Record<string, number> = {
          VIP: 0,
          Delux: 0,
          Comfort: 0,
        };

        data.forEach((room: any) => {
          const roomName = room.name.toLowerCase();
          allowedTypes.forEach((type, index) => {
            if (roomName.includes(type)) {
              // Maintain proper case for legend
              const key = ["VIP", "Delux", "Comfort"][index];
              counts[key] += 1;
            }
          });
        });

        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

        const formatted = Object.entries(counts).map(([name, count]) => ({
          name,
          value: Math.round((count / total) * 100),
        }));

        setRoomData(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
  }: PieLabelRenderProps) => {
    if (
      typeof cx !== "number" ||
      typeof cy !== "number" ||
      typeof midAngle !== "number" ||
      typeof outerRadius !== "number" ||
      typeof index !== "number"
    ) {
      return null;
    }

    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {roomData[index]?.value}%
      </text>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white py-2 rounded-t-md shadow-md pl-3 w-full">
        <h2 className="text-lg font-semibold pb-1">Room type Occupancy</h2>
      </div>

      <div className="bg-white py-2 rounded-b-md shadow-md mb-4">
        <div className="relative w-full h-68">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={roomData}
                innerRadius={70}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                paddingAngle={1}
                dataKey="value"
                stroke="none"
                labelLine={true}
                label={renderCustomizedLabel}
              >
                {roomData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <svg
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            {[33, 47, 60].map((r, i) => (
              <circle
                key={i}
                cx="50%"
                cy="50%"
                r={r}
                stroke="#8A2BE2"
                strokeDasharray="5 5"
                fill="none"
              />
            ))}
          </svg>
        </div>

        {/* Dynamic Legend */}
        <div className="flex justify-center gap-4 mb-3 text-sm">
          {roomData.map((room, index) => (
            <span key={room.name} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              {room.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";

const EmpAvailableRooms: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://185.170.58.79:5000/api/rooms",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRooms(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch available rooms. Please try again later.");
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // filtered avaliable rooms
  const availableRooms = rooms.filter((room) => room.status === "Available");

  return (
    <div className="mt-5">
      {/* Available Rooms Table */}
      <div>
        {loading ? (
          <p className="text-center text-orange-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg mb-5">
            <table className="min-w-full bg-white shadow-xl rounded-2xl border border-gray-200">
              <thead className="text-[20px] font-bold text-[#00000080]">
                <tr>
                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Room No
                  </th>
                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Room Type
                  </th>
                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Price
                  </th>
                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Amenities
                  </th>
                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-[16px] text-[#00000066]">
                {availableRooms.length > 0 ? (
                  availableRooms.map((room, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3 px-4 border border-gray-300 text-gray-700 text-16">
                        {room.roomNumber || index + 1}
                      </td>
                      <td className="py-3 px-4 border border-gray-300 text-gray-700 text-16">
                        {room.roomType || "N/A"}
                      </td>
                      <td className="py-3 px-4 border border-gray-300 text-gray-700 text-16">
                        {room.price || "N/A"}
                      </td>
                      <td className="py-3 px-4 border border-gray-300 text-gray-700 text-16">
                        {room.amenities?.join(", ") || "N/A"}
                      </td>
                      <td className="py-3 px-4 border border-gray-300 text-gray-700 text-16">
                        {room.status || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 border border-gray-300 text-gray-500 text-16"
                    >
                      No available rooms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpAvailableRooms;

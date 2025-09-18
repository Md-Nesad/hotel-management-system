import React, { useEffect, useState } from "react";
import axios from "axios";

const BookedRooms: React.FC = () => {
  const [bookedRooms, setBookedRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookedRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://185.170.58.79:5000/api/book", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookedRooms(response?.data?.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch booked rooms. Please try again later.");
        console.error("Error fetching booked rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookedRooms();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-center text-orange-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-[#00000080] text-[20px]">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Room No
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Guest Name
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Email
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Phone
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Check-in
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Check-out
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Nights
                </th>
                <th className="py-2 px-4 text-left text-gray-600 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="text-[16px] text-[#00000066]">
              {bookedRooms?.length > 0 ? (
                bookedRooms?.map((room, index) => {
                  return (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {room.guestName}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {room.email || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {room.phone || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {room.checkInDate || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {room.checkOutDate || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{"N/A"}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            room.bookingStatus === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : room.bookingStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : room.bookingStatus === "Checked In"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.bookingStatus || "N/A"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No booked rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookedRooms;

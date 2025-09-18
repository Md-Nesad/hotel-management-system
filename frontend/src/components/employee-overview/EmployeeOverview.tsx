import React, { useState, useEffect } from "react";
import axios from "axios";

interface Room {
  id: number;
  name: string;
  beds: string;
  baths: string;
  roomType: string;
  price: string;
  amenities: string[];
  status: "Available" | "Booked";
  checkIn: string;
  checkOut: string;
}

interface Props {
  filter: "All" | "Available" | "Booked";
}

const EmployeeAllRoom: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://185.170.58.79:5000/api/rooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data);
      } catch (err) {
        setError("Failed to fetch rooms. Please try again later." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-orange-500">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-orange-500">{error}</div>;

  return (
    <div>
      <div>
        <RoomList filter="All" rooms={rooms} />
      </div>
    </div>
  );
};

const RoomList: React.FC<Props & { rooms: Room[] }> = ({ filter, rooms }) => {
  const filteredRooms =
    filter === "All" ? rooms : rooms.filter((room) => room.status === filter);

  return (
    <div className="text-base shadow-[0_0_3px_rgba(0,0,0,0.25)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs bg-white rounded-lg overflow-hidden">
          <thead className="text-[20px] text-[#00000080]">
            <tr>
              {[
                "Room Name",
                "Beds/ Bath type",
                "Room Type",
                "Rate",
                "Amenities",
                "Status",
                "Check-In",
                "Check-Out",
              ].map((col) => (
                <th
                  key={col}
                  className="border border-gray-200 px-3 py-5 text-left"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[15px]">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <tr
                  key={index}
                  className="border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]"
                >
                  <td className="border border-gray-200 px-3 py-2 w-[150px]">
                    {room.name || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 w-[176px]">
                    {room.beds || "-"}, {room.baths || "-"}
                  </td>

                  <td className="border border-gray-200 w-[130px] px-3 py-2">
                    {room.roomType || "N/A"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 w-[100px]">
                    {room.price || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 w-[193px]">
                    {room.amenities?.length ? room.amenities.join(", ") : "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <span className="px-2 py-1 rounded-full text-16 ">
                      {room.status || "N/A"}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {room.checkIn || ""}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {room.checkOut || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAllRoom;

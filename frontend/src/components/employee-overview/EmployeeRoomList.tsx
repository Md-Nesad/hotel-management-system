import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

interface Room {
  roomNo: string;
  roomType: string;
  price: string;
  status: string;
  amenities: string;
  floor: string;
  id: string;
}

const EmpRoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://185.170.58.79:5000/api/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch rooms");
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);
  //filtered data from UI based on user input
  const filteredRooms = rooms.filter((room) =>
    Object.values(room).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading)
    return <div className="p-4 text-orange-500 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-black">Error: {error}</div>;

  return (
    <div className="text-[#000000]">
      {/* Title and Search */}

      <div className="bg-white shadow-[0_0_3px_rgba(0,0,0,0.25)] mb-4 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
        {/* Title */}
        <h1 className="text-2xl  font-bold text-[#00000080] md:mb-0">
          Room List
        </h1>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Room No / Room Type / Floor"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <FiSearch className="absolute right-3 top-2.5 w-5 h-5 text-gray-600" />
        </div>
      </div>

      <div className="overflow-x-auto shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg">
        <table className="w-full text-xl border border-gray-300 border-collapse">
          <thead className="font-bold text-[20px] text-left text-[#00000080]">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-xl rounded-tl-lg">
                Room No
              </th>
              <th className="border border-gray-300 p-2  text-xl ">
                Room Type
              </th>
              <th className="border border-gray-300 p-2 text-xl ">Price</th>
              <th className="border border-gray-300 p-2 text-xl ">Status</th>
              <th className="border border-gray-300 p-2 text-xl ">Amenities</th>
            </tr>
          </thead>
          <tbody className="text-[16px] text-[#00000066]">
            {filteredRooms.map((room, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 text-base font-bold transition-colors"
              >
                <td className="border text-base  border-gray-300 py-4 px-3 text-[16px]">
                  {room.roomNo || index + 1}
                </td>
                <td className="border text-base border-gray-300 p-2 text-[16px]">
                  {room.roomType || "N/A"}
                </td>
                <td className="border text-base border-gray-300 p-2 text-[16px]">
                  {room.price}
                </td>
                <td className="border text-base  border-gray-300 p-2 text-[16px]">
                  {room.status}
                </td>
                <td className="border border-gray text-base px-3 py-2">
                  {room.amenities}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpRoomList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import HouseKeeper from "../icons/HouseKeeper";
import { X } from "lucide-react";

interface Room {
  _id: string;
  id: number;
  name: string;
  beds: string;
  baths: string;
  bed_size: string;
  housekeepingStatus: string;
  description: string;
  roomType: string;
  price: number;
  amenities: string[];
  status: "Available" | "Booked" | "Unavailable";
  checkIn: string;
  checkOut: string;
}

interface Props {
  filter: "All" | "Available" | "Booked";
}

const AllRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.bahamaslrb.com/api/rooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data);
      } catch (err) {
        setError(
          "Failed to fetch rooms. Please try again later please. " + err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
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
  const [openFormRoomId, setOpenFormRoomId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ houseKeeperName: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const filteredRooms =
    filter === "All" ? rooms : rooms.filter((room) => room.status === filter);

  return (
    <div className="text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl">
      <div className="overflow-y-visible">
        <table className="min-w-full border border-gray-300 text-xs bg-white rounded-xl">
          <thead className="text-[15px] text-[#00000080]">
            <tr>
              {[
                "Status",
                "House Keeping",
                "Room No/ Bed Size",
                "Room Name",
                "Beds/ Bath",
                "Description",
                "Check-In/Check-out time",
                "Duration",
                "Price / Discount",
                "Amenities",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="border border-gray-200 px-2 py-1 text-left"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {filteredRooms.length > 0 ? (
              filteredRooms.slice(0, 6).map((room) => (
                <tr
                  key={room._id}
                  className="border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]"
                >
                  <td className="border border-gray-200 px-1 py-3 w-[60px]">
                    <span
                      className={` rounded-md text-16 p-1 ${
                        room.status === "Available"
                          ? "bg-[#00FF11] text-white"
                          : room.status === "Unavailable"
                          ? "bg-[#FF8888]"
                          : "bg-[#0033FF] text-white"
                      }`}
                    >
                      {room.status || "N/A"}
                    </span>
                  </td>
                  <td className="border border-gray-200 text-[#196199] font-bold pl-3 py-2 w-[106px]">
                    {room.housekeepingStatus[0].toUpperCase() +
                      room.housekeepingStatus?.slice(1) || "N/A"}
                  </td>

                  <td className="border border-gray-200 w-[400px] px-2 py-3">
                    {room.bed_size || "N/A"}
                  </td>
                  <td className="border border-gray-200 pl-2 py-3 w-[630px]">
                    {room.name || "N/A"}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 w-[193px]">
                    {room.baths && room.beds !== null
                      ? `${room.beds} Beds, ${room.baths} Baths`
                      : "N/A"}
                  </td>
                  <td className="border border-gray-200 px-2 py-3 w-[523px]">
                    {room.description?.slice(1, 27) || "N/A"}
                  </td>
                  <td className="border border-gray-200 text-center px-1 py-3 w-[703px]">
                    ---
                  </td>
                  <td className="border border-gray-200 pl-2 py-3 text-center mr-3">
                    ---
                  </td>
                  <td className="border border-gray-200 pl-2 py-3 mr-3">
                    <span className="line-through">
                      {Math.ceil(room.price * 1.33333)?.toLocaleString() ||
                        "N/A"}
                      Frw
                    </span>
                    <br />
                    <span>{room.price.toLocaleString() || "N/A"}Frw</span>
                  </td>
                  <td className="border border-gray-200 px-3 py-3 w-[200px]">
                    {room.amenities?.join(", ")?.slice(0, 20) || "-"}...
                  </td>
                  <td className="border border-gray-200 px-2 py-1 w-[120px]">
                    <div className="flex gap-1">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenFormRoomId(
                              openFormRoomId === room._id ? null : room._id
                            )
                          }
                          className="text-black bg-gray-300 p-1 rounded-xs cursor-pointer"
                        >
                          <HouseKeeper />
                        </button>

                        {openFormRoomId === room._id && (
                          <div className="absolute z-20 top-8 right-0 bg-white border border-gray-300 shadow-lg p-2 rounded-md w-48">
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                  if (
                                    !formData.houseKeeperName ||
                                    !formData.notes
                                  ) {
                                    alert("Please enter name and notes");
                                    return;
                                  }
                                  const token = localStorage.getItem("token");
                                  await axios.post(
                                    "https://backend.bahamaslrb.com/housekeeping",
                                    {
                                      houseKeeperName: formData.houseKeeperName,
                                      notes: formData.notes,
                                      room: room._id,
                                      status: room.housekeepingStatus,
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  alert("Submitted successfully!");
                                  setFormData({
                                    houseKeeperName: "",
                                    notes: "",
                                  });
                                  setOpenFormRoomId(null);
                                } catch (err) {
                                  alert("Failed to submit");
                                }
                              }}
                              className="space-y-1 text-[12px]"
                            >
                              <input
                                type="text"
                                placeholder="Name"
                                value={formData.houseKeeperName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    houseKeeperName: e.target.value,
                                  })
                                }
                                className="border p-1 w-full rounded"
                              />
                              <textarea
                                placeholder="Notes"
                                value={formData.notes}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                  })
                                }
                                className="border p-1 w-full rounded"
                              />
                              <button
                                type="submit"
                                disabled={
                                  !formData.houseKeeperName || !formData.notes
                                }
                                onClick={() => setSubmitting(true)}
                                className={`text-white text-xs px-2 py-1 rounded w-full cursor-pointer transition-colors duration-150
                                ${
                                  !formData.houseKeeperName || !formData.notes
                                    ? "bg-gray-400 pointer-events-none"
                                    : "bg-blue-500 hover:bg-[#F9862D]"
                                }`}
                              >
                                {submitting ? "Submitting..." : "Submit"}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>

                      <button className="text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs">
                        <X size={19} strokeWidth={2} />
                      </button>
                    </div>
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

export default AllRooms;

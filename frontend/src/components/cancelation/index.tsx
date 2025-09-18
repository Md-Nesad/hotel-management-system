// import React, { useEffect, useState } from "react";
// import axios from "axios";

import axios from "axios";
import { useEffect, useState } from "react";

const UnAvailableRooms: React.FC = () => {
  const [cancelled, setCancelled] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.bahamaslrb.com/api/bookings/cancelled",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCancelled(response.data?.bookings);
        setError(null);
      } catch (err) {
        setError("Failed to fetch cancelled bookings. Please try again later.");
        console.error("Error fetching cancelled bookings:", err);
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
    <>
      <div className="mb-4">
        <h2 className="text-[16px] text-center font-semibold text-[#2e2e2e] border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)]">
          Cancellation
        </h2>
      </div>

      <div className="text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs bg-white rounded-xl overflow-hidden">
            <thead className="text-[15px] text-[#00000080]">
              <tr>
                {[
                  "Guest(s)",
                  "Room No/Bed Size",
                  "Room Name",
                  "Beds/Baths",
                  "Cancellation Reasons",
                  "Notes",
                  "Cancelled by",
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
              {cancelled.length > 0 ? (
                cancelled.map((cancel) => (
                  <tr
                    key={cancel._id}
                    className="border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]"
                  >
                    <td className="border border-gray-200 px-3">
                      <span className=" rounded-full text-16 ">
                        {cancel.firstName + " " + cancel.lastName || "N/A"}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {cancel.room?.bed_size || "Queen Bed"}
                    </td>

                    <td className="border border-gray-200 px-3 py-3">
                      {cancel.room?.name || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-2 py-3">
                      {cancel.room?.baths && cancel.room?.beds !== null
                        ? `${cancel.room?.beds} Beds, ${cancel.room?.baths} Baths`
                        : "N/A"}
                    </td>
                    <td className="border border-gray-200 px-2 py-3">
                      {cancel.reason || "Guest changed travel plans."}
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      Room cleaned and ready for next guest.
                    </td>
                    <td className="border border-gray-200 px-3 py-3">
                      {cancel.canceledBy || "Joga Fokir"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No cancellation found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UnAvailableRooms;

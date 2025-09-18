import React, { useEffect, useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import axios from "axios";

interface Guest {
  _id: string;
  guestName: string;
  guestEmail: string;
  phoneNumber: string;
  arrivalTime: string;
  checkIn: string;
  checkOut: string;
  roomType: any;
  paymentStatus: string;
}

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized access. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backend.bahamaslrb.com/api/guest-bookings/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch guests.");
        }

        const data = await response.json();
        setGuests(data?.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return; // User canceled
    try {
      await axios.delete(
        `https://backend.bahamaslrb.com/api/guest-bookings/delete/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Guest deleted successfully!");
      setGuests(guests.filter((guest) => guest._id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4  text-center">Loading...</div>;
  }

  return (
    <div className="text-[#00000066]">
      <div className="mb-6 p-2 rounded shadow-[0_0_4px_rgba(0,0,0,0.25)]">
        <h2 className="text-[20px] text-[#00000066] mb-2 md:mb-0 font-extrabold text-center">
          Guest List
        </h2>
      </div>

      <div className="overflow-x-auto shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg">
        <table className="w-full text-xl border border-gray-300 border-collapse">
          <thead className="font-bold text-[20px] text-left text-[#00000080]">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-xl rounded-tl-lg">
                Guest(s)
              </th>
              <th className="border border-gray-300 p-2 text-xl">Phone</th>
              <th className="border border-gray-300 p-2 text-xl">Email</th>
              <th className="border border-gray-300 p-2 text-xl">
                Last Room Book
              </th>

              <th className="border border-gray-300 p-2 text-xl">Action</th>
            </tr>
          </thead>
          <tbody className="text-[16px] text-[#00000066]">
            {error && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!error && guests.length > 0 ? (
              guests.map((guest, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 text-base font-bold transition-colors"
                >
                  <td className="border text-base border-gray-300 py-4 px-3 text-[16px]">
                    {guest.guestName}
                  </td>
                  <td className="border text-base border-gray-300 p-2 text-[16px]">
                    {guest.phoneNumber}
                  </td>
                  <td className="border text-base border-gray-300 p-2 text-[16px]">
                    {guest.guestEmail}
                  </td>
                  <td className="border text-base border-gray-300 p-2 text-[16px]">
                    305 B, Queen Bed
                  </td>

                  <td className="border border-gray-200 px-2 py-1 w-[120px]">
                    <div className="flex items-center ml-2 space-x-2">
                      <button
                        title="Edit"
                        className="text-black bg-gray-300 p-1 rounded-xs"
                      >
                        <Pen size={16} />
                      </button>

                      {/* <button
                        title="archive"
                        className=" bg-gray-300 p-1 rounded-xs"
                      >
                        <FolderX className="text-black" size={16} />
                      </button> */}

                      <button
                        onClick={() => handleDelete(guest._id)}
                        title="Delete"
                        className=" text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : !error ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No guests found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;

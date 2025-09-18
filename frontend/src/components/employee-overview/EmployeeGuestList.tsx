import React, { useEffect, useState } from "react";

interface Guest {
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
  const [searchTerm, setSearchTerm] = useState("");
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
          "http://185.170.58.79:5000/api/guest-bookings/all",
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

  const filteredGuests = guests.filter((guest) =>
    Object.values(guest).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div className="p-4 text-orange-500 text-center">Loading...</div>;
  }

  return (
    <div className="text-[#00000066]">
      <div className="flex mb-6 flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-gray-300 rounded">
        <h1 className="text-[20px] text-[#00000066] mb-2 md:mb-0 font-extrabold">
          Guest List
        </h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Room No / Room Type / Floor"
          className="p-2 border border-gray-300 rounded-full outline-none focus:border-orange-500 w-full max-w-md text-sm"
        />
      </div>

      <div className="overflow-x-auto shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg">
        <table className="w-full text-xl border border-gray-300 border-collapse">
          <thead className="font-bold text-[20px] text-left text-[#00000080]">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-xl rounded-tl-lg">
                Guest Name
              </th>
              <th className="border border-gray-300 p-2 text-xl">Email</th>
              <th className="border border-gray-300 p-2 text-xl">Phone</th>
              <th className="border border-gray-300 p-2 text-xl">Date Order</th>
              <th className="border border-gray-300 p-2 text-xl">
                Last Check-in
              </th>
              <th className="border border-gray-300 p-2 text-xl">
                Last Check-out
              </th>
              <th className="border border-gray-300 p-2 text-xl">Room Type</th>
              <th className="border border-gray-300 p-2 text-xl">Status</th>
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

            {!error && filteredGuests.length > 0 ? (
              filteredGuests.map((guest, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 text-base font-bold transition-colors"
                >
                  <td className="border text-base border-gray-300 py-4 px-3 text-[16px]">
                    {guest.guestName}
                  </td>
                  <td className="border text-base border-gray-300 p-2 text-[16px]">
                    {guest.guestEmail}
                  </td>
                  <td className="border text-base border-gray-300 p-2 text-[16px]">
                    {guest.phoneNumber}
                  </td>
                  <td className="border text-base border-gray-300 p-2 text-[16px]">
                    {guest.arrivalTime}
                  </td>
                  <td className="border border-gray text-base px-3 py-2">
                    {guest.checkIn}
                  </td>
                  <td className="border border-gray text-base px-2 py-2">
                    {guest.checkOut}
                  </td>
                  <td className="border border-gray text-base px-2 py-2 w-[130px]">
                    {guest.roomType || "N/A"}
                  </td>
                  <td className="border border-gray text-base px-2 py-2">
                    {guest.paymentStatus}
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

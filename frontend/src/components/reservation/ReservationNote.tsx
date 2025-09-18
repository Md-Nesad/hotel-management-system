import { useState } from "react";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";

const ReservationNote = ({ bookingId }: { bookingId: string }) => {
  const [status, setStatus] = useState("");

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    try {
      const response = await axios.patch(
        `https://backend.bahamaslrb.com/api/booking/${bookingId}/reservation`,
        { reservationStatus: selectedStatus }
      );
      alert(response.data.message);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update status.");
    }
  };

  return (
    <div>
      <div className="relative">
        <select
          id="reservationStatus"
          value={status}
          onChange={handleStatusChange}
          className={`border border-gray-300 rounded-md w-46 py-2 px-3 appearance-none ${
            status === "check in"
              ? "bg-[#00D781] text-white border-gray-200 outline-none"
              : status === "check out"
              ? "bg-[#A4A4A4] text-white border-gray-200 outline-none"
              : status === "on hold"
              ? "bg-[#F9862D] text-white border-gray-200 outline-none"
              : "bg-[#00D781] text-white border-gray-200 outline-none"
          } `}
        >
          <option value="check in">Check In</option>
          <option value="check out">Check Out</option>
          <option value="on hold">On Hold</option>
        </select>
        <FiChevronDown className="absolute right-3 top-3 text-white pointer-events-none" />
      </div>
    </div>
  );
};

export default ReservationNote;

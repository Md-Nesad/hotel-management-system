import { Link } from "react-router-dom";

export default function BookingNav() {
  return (
    <div className="flex justify-between items-center bg-white py-2 px-8 rounded-lg shadow-[0_0_3px_rgba(0,0,0,0.25)] border-gray-300 mb-4 ">
      <div>
        <h2 className="text-xl text-orange-400 font-semibold border-b-2 border-ornange-400 pb-1">
          BOOKING
        </h2>
      </div>

      <Link to="/dashboard/add_booking">
        <div className="bg-gray-400 text-white font-semibold px-7 py-2 rounded-lg cursor-pointer hover:bg-orange-500 transition-colors">
          {" "}
          <h2>+ New Booking</h2>
        </div>
      </Link>
    </div>
  );
}

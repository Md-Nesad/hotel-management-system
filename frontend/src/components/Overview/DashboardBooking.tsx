import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Booking {
  _id?: string;
  guestName: string;
  bookingMethod: string;
  date: string;
  time: string;
  specialNote: string;
}

// const BookingEditModal = ({ open, onClose, booking }: { open: boolean; onClose: () => void; booking: Booking | null }) => {
//   if (!open || !booking) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-30">
//       <div className="bg-white rounded-xl w-full max-w-7xl mx-auto shadow-lg relative animate-fade-in">
//         <button
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
//           onClick={onClose}
//         >
//           &times;
//         </button>
//         <div className="border-b px-8 pt-6 pb-4">
//           <h2 className="text-xl font-semibold text-gray-700 text-center">Booking</h2>
//         </div>
//         <form className="px-8 py-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Guest Name</label>
//               <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" value={booking.guestName}  />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Booking Method</label>
//               <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" value={booking.bookingMethod}  />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Room No/Type</label>
//               <select className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" >
//                 <option>Room 02 (Family Suite)</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">No of Guest</label>
//               <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" value="4"  />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Check in Date</label>
//               <div className="relative">
//                 <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500 pr-10" value="20 June, 2025"  />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 2V4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="6" width="14" height="11" rx="2" stroke="#64748B" strokeWidth="1.5"/><path d="M16.5 8H3.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                 </span>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Check out Date</label>
//               <div className="relative">
//                 <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500 pr-10" value="23 June, 2025"  />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 2V4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="6" width="14" height="11" rx="2" stroke="#64748B" strokeWidth="1.5"/><path d="M16.5 8H3.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                 </span>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Booking Date & Time</label>
//               <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" value="20 June, 2025 (Auto filed)"  />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Payment Status</label>
//               <select className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" >
//                 <option>Paid</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Booking Status</label>
//               <select className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" >
//                 <option>Confirmed</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Assigned By</label>
//               <select className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" >
//                 <option>Admin</option>
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Special Note</label>
//               <input type="text" className="w-full p-2 rounded-md border bg-gray-100 text-gray-500" value={booking.specialNote}  />
//             </div>
//           </div>
//           <div className="flex justify-end gap-4 mt-8">
//             <button type="button" className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md font-medium hover:bg-orange-50 transition" onClick={onClose}>Cancel</button>
//             <button type="button" className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition">Update</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

const DashboardBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  console.log(bookings);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://185.170.58.79:5000/api/book", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        const sampleBookings: Booking[] = [
          {
            guestName: "Alice Smith",
            bookingMethod: "Phone",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Angel Lara",
            bookingMethod: "Online",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Jonathan",
            bookingMethod: "Person",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Alice Smith",
            bookingMethod: "Phone",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Alice Smith",
            bookingMethod: "Phone",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Alice Smith",
            bookingMethod: "Phone",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Alice Smith",
            bookingMethod: "Phone",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Alice Smith",
            bookingMethod: "Phone",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Angel Lara",
            bookingMethod: "Online",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Jonathan",
            bookingMethod: "Person",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Jonathan",
            bookingMethod: "Person",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
          {
            guestName: "Jonathan",
            bookingMethod: "Person",
            date: "25 June 2025",
            time: "5:30 PM",
            specialNote: "Early check-in needed",
          },
        ];
        setBookings(sampleBookings);
      }
    };

    fetchBookings();
  }, []);

  // const handleEditClick = (booking: Booking) => {
  //   setSelectedBooking(booking);
  //   setModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setModalOpen(false);
  //   setSelectedBooking(null);
  // };

  return (
    <div className="min-h-screen">
      <div className="py-4 my-4 rounded-xl border border-gray-200 bg-white w-full  mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600 text-center">
          Booking Details
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 w-full  mx-auto overflow-x-auto">
        <table className="w-full  text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Guest Name</th>
              <th className="px-6 py-3">Booking Method</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Special Note</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr
                  key={index}
                  className="bg-white border border-gray-200 last:border-b-0"
                >
                  <td className="px-6 py-4 whitespace-nowrap  border border-gray-200">
                    {booking.guestName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    {booking.bookingMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    {booking.date || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    {booking.time || "N/A"}
                  </td>
                  <td className="px-6 py-4 border border-gray-200">
                    {booking.specialNote}
                  </td>
                  <td className="px-6 py-4 text-center border border-gray-200">
                    <Link to={`/dashboard/editdashboardbooking/${booking._id}`}>
                      <button className="text-gray-500 hover:text-indigo-600 transition">
                        <Edit className="w-5 h-5" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500 bg-gray-50 border border-gray-200"
                >
                  No booking details found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardBooking;

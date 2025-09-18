import * as Tabs from "@radix-ui/react-tabs";
import { Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import AllReservation from "./AllReservation";
import CheckInReservation from "./CheckInReservation";
import CheckOutReservation from "./CheckOutReservation";
import HoldReservation from "./HoldReservation";
import { Search } from "lucide-react";
import axios from "axios";

export default function ReservationTabs() {
  const [booking, setBooking] = useState<any[]>([]);
  console.log(booking);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend.bahamaslrb.com/api/bookings/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooking(response.data);
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

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );
    if (!confirmed) return; // User canceled
    try {
      await axios.delete(`https://backend.bahamaslrb.com/api/booking/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Reservation deleted successfully!");
      setBooking(booking.filter((book) => book._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (error) return <div className="p-6 text-center">{error}</div>;

  // Filtering logic
  const filteredBookings = booking.filter((booking) => {
    const search = searchTerm.toLowerCase();
    return (
      booking.firstName.toLowerCase().includes(search) ||
      booking.lastName.toLowerCase().includes(search) ||
      booking.phone.includes(search) ||
      booking.email.toLowerCase().includes(search) ||
      booking.confirmationNumber.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      {/* Tabs */}
      <Tabs.Root defaultValue="reservation">
        <Tabs.List className="text-[16px] font-bold flex gap-x-4 items-center border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)] mb-4">
          <Tabs.Trigger
            value="reservation"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            ALL RESERVATION
          </Tabs.Trigger>
          <Tabs.Trigger
            value="checkIn"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            CHECKED-IN
          </Tabs.Trigger>
          <Tabs.Trigger
            value="checkOut"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            CHECKED-OUT
          </Tabs.Trigger>
          <Tabs.Trigger
            value="onHold"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            ON-HOLD
          </Tabs.Trigger>

          <div className="sm:ml-auto sm:mr-10">
            <div className="relative w-[400px]">
              <input
                type="text"
                placeholder="Search by name, phone, email or confirmation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                <Search className="w-5 h-5" />
              </span>
            </div>
          </div>
        </Tabs.List>

        <Box pt="2">
          <Tabs.Content value="reservation">
            <AllReservation
              bookings={filteredBookings}
              onDelete={handleDelete}
            />
          </Tabs.Content>
          <Tabs.Content value="checkIn">
            <CheckInReservation
              bookings={filteredBookings.filter(
                (b) => b.reservationStatus === "check in"
              )}
              onDelete={handleDelete}
            />
          </Tabs.Content>
          <Tabs.Content value="checkOut">
            <CheckOutReservation
              bookings={filteredBookings.filter(
                (b) => b.reservationStatus === "check out"
              )}
              onDelete={handleDelete}
            />
          </Tabs.Content>
          <Tabs.Content value="onHold">
            <HoldReservation
              bookings={filteredBookings.filter(
                (b) => b.reservationStatus === "on hold"
              )}
              onDelete={handleDelete}
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

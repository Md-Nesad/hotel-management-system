import { useLocation, useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import Footer from "../components/common/footer";
import { useState } from "react";
import axios from "axios";

const RoomDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  console.log(booking);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  function formatCheckInDate(dateStr: string): string {
    const date = new Date(dateStr);

    const getOrdinal = (n: number): string => {
      if (n >= 11 && n <= 13) return `${n}th`;
      const lastDigit = n % 10;
      if (lastDigit === 1) return `${n}st`;
      if (lastDigit === 2) return `${n}nd`;
      if (lastDigit === 3) return `${n}rd`;
      return `${n}th`;
    };

    const day = date.getDate();
    const ordinalDay = getOrdinal(day);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${month} ${ordinalDay} ${year}`;
  }

  //handle canel booking
  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      const bookingId = booking.booking?._id;
      const response = await axios.patch(
        `https://backend.bahamaslrb.com/api/booking/${bookingId}/cancel`,
        {
          reason: cancelReason,
        }
      );

      alert(response.data.message);
      setCancelReason("");
      setShowCancelReason(false);
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.error || "Failed to cancel booking.";

      alert(errorMessage);
      setCancelReason("");
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-center">No booking data found.</p>
      </div>
    );
  }

  return (
    <>
      <div className=" bg-white flex items-center justify-center p-6 mt-10 pb-12">
        <div className="w-full max-w-xl border border-gray-300 shadow-md rounded-md p-13 text-gray-800 mt-10">
          <h2 className="text-center text-3xl font-bold mb-2">Reservation</h2>
          <p className="text-center text-2xl text-gray-800 mt-1">
            Guest Reservation Details
          </p>

          <div className="mt-6 space-y-3 text-[18px]">
            <h3 className="text-xl font-semibold text-center mb-4">
              Guest Details
            </h3>
            <p>
              <strong className="font-semibold">Guest:</strong>{" "}
              {booking.booking.firstName} {booking.booking.lastName}
            </p>
            <p>
              <strong className="font-semibold">Phone: </strong>
              {booking.booking.phone}
            </p>
            <p>
              <strong className="font-semibold">Email:</strong>{" "}
              {booking.booking.email}
            </p>
            <p>
              <strong className="font-semibold">Confirmation:</strong>{" "}
              {booking.booking.confirmationNumber}
            </p>

            <p>
              <strong className="font-semibold">Price:</strong>{" "}
              <span className="line-through text-gray-500">
                FWR
                {Math.ceil(
                  booking.booking?.room?.price * 1.33333
                ).toLocaleString() || 20}
              </span>{" "}
              <span className=" font-semibold">
                {parseFloat(booking.booking?.room?.price).toLocaleString() ||
                  15}{" "}
                (20% discount)
              </span>
            </p>
          </div>

          <div className="mt-6 space-y-3 text-[17px]">
            <h3 className="text-xl font-semibold text-center mb-4">
              Room Details
            </h3>
            <p>
              <strong className="font-semibold">Name:</strong>{" "}
              {booking.booking?.room?.name || "VIP SINGLE ROOM"}
            </p>
            <p>
              <strong className="font-semibold">BED:</strong>{" "}
              {booking.booking?.room?.beds || "1 King"} beds
            </p>
            <p>
              <strong className="font-semibold">BATH:</strong>{" "}
              {booking.booking?.room?.baths || "1"} baths
            </p>

            <p>
              <strong className="font-semibold">Description:</strong>{" "}
              {booking.booking?.room?.description || "N/A"}
            </p>

            <p>
              <strong className="font-semibold">Check In:</strong>{" "}
              {formatCheckInDate(booking.booking.checkIn)} @4 pm
            </p>
            <p>
              <strong className="font-semibold">Check Out:</strong>{" "}
              {formatCheckInDate(booking.booking.checkOut)} @11 am
            </p>

            <p>
              <strong className="font-semibold">Duration:</strong>{" "}
              {(() => {
                const checkIn = new Date(booking.booking.checkIn);
                const checkOut = new Date(booking.booking.checkOut);
                const diffInMs = checkOut.getTime() - checkIn.getTime();
                const diffInHours = diffInMs / (1000 * 60 * 60);
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                // If duration is less than 24 hours, show in hours
                if (diffInHours < 24) {
                  return `${Math.ceil(diffInHours)} hour(s)`;
                } else {
                  return `${Math.ceil(diffInDays)} days`;
                }
              })()}
            </p>

            <p>
              <strong className="font-semibold">Aminities:</strong>{" "}
              {booking.booking?.room?.amenities.join(", ") ||
                "Free Wifi, Free parking, TV, Food Available, "}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#F9862D] hover:bg-orange-600 text-white px-6 py-2 rounded shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <TiArrowBack className="text-lg" />
              <span>Back Home</span>
            </button>

            {/* Cancel Reservation Button */}
            <button
              onClick={() => setShowCancelReason(!showCancelReason)}
              className="w-full bg-[#F9862D] hover:bg-orange-600 text-white px-6 py-2 rounded shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Cancel Reservation
            </button>

            {/* Cancellation Reason Input */}
            {showCancelReason && (
              <div className="space-y-3 mt-4">
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Why do you want to cancel this reservation?"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />

                <button
                  onClick={handleCancelBooking}
                  className="w-full bg-[#F9862D] hover:bg-orange-600 text-white px-6 py-2 rounded shadow-sm transition-all duration-300 cursor-pointer"
                >
                  Confirm Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomDetails;

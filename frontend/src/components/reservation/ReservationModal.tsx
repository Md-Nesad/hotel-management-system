type Room = {
  bed_size: string;
  beds: string;
  baths: string;
  price: number;
  name: string;
  amenities: string[];
};

type Booking = {
  _id: string;
  reservationStatus: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  confirmationNumber: string;
  room: Room;
  bedsBath: string;
  checkOut: string;
  checkIn: string;
  duration: string;
  price: number;
  source: string;
  amenities: string[];
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
};

const ReservationModal = ({ isOpen, onClose, booking }: ModalProps) => {
  console.log("booking", booking);
  if (!isOpen || !booking) return null;

  const durationDays =
    booking.checkIn && booking.checkOut
      ? Math.ceil(
          (new Date(booking.checkOut).getTime() -
            new Date(booking.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] p-5 relative flex flex-col">
        <h2 className="text-center text-2xl font-bold text-black mb-4">
          Reservation Details
        </h2>
        <div className="flex-grow overflow-y-auto space-y-3 text-sm text-gray-700">
          {/* Guest Name */}
          <p>
            <strong>Guest: </strong>
            {booking.firstName} {booking.lastName}
          </p>

          <p>
            <strong>Status:</strong> {booking.reservationStatus}
          </p>
          <p>
            <strong>Email:</strong> {booking.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {booking.phone || "N/A"}
          </p>
          <p>
            <strong>Confirmation Number:</strong>{" "}
            {booking.confirmationNumber || "N/A"}
          </p>
          <p>
            <strong>Room Name:</strong> {booking?.room?.name || "Walk-in"}
          </p>
          <p>
            <strong>Room No/ Bed Size :</strong>{" "}
            {booking.room?.bed_size || "N/A"}
          </p>

          <p>
            <strong>Beds /Bath: </strong>
            {booking.room?.beds ? `${booking.room?.beds} Beds` : "N/A"},{" "}
            {booking.room?.baths ? `${booking.room?.baths} Baths` : ""}
          </p>

          <p>
            <strong>Check-In:</strong> {booking.checkIn?.slice(0, 10)} @4PM
          </p>
          <p>
            <strong>Check-Out:</strong> {booking.checkOut?.slice(0, 10)} @11AM
          </p>

          {durationDays && (
            <p>
              <strong>Duration:</strong> {durationDays} day
              {durationDays > 1 ? "s" : ""}
            </p>
          )}

          <p>
            <strong>Price:</strong>{" "}
            <span className="line-through mr-2 text-gray-400">
              {Math.ceil(booking.room?.price * 1.333333).toLocaleString()}Fr
            </span>
            <span>{booking.room?.price.toLocaleString()}Fr</span>
          </p>

          <p>
            <strong>Source:</strong> {booking.source || "Walk-in"}
          </p>

          <p>
            <strong>Amenities:</strong>{" "}
            {booking.room?.amenities?.length
              ? booking.room.amenities.join(", ")
              : "N/A"}
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-4 flex justify-center shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;

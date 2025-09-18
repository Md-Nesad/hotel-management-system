import { useState } from "react";
import { useParams } from "react-router-dom";

export default function EditDashBoardBooking() {
  const { bookingId } = useParams();

  const [formData, setFormData] = useState({
    guestName: "",
    bookingMethod: "online",
    roomType: "",
    numberOfGuests: 2,
    checkInDate: "2025-07-05",
    checkOutDate: "2025-07-08",
    bookingDateTime: "2025-07-01T10:30:00.000Z",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    assignedBy: "Admin",
    specialNote: "No special note",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfGuests" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.guestName ||
      !formData.bookingMethod ||
      !formData.roomType ||
      !formData.bookingStatus ||
      !formData.paymentStatus
    ) {
      alert("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://185.170.58.79:5000/api/book/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Response:", result);
      if (response.ok) {
        alert("Booking updated successfully!");
      } else {
        alert("Failed to update booking: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 px-15 rounded-xl shadow-md text-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-center border-b border-gray-300 pb-2">
        Booking
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1 font-bold">Guest Name</label>
          <input
            type="text"
            name="guestName"
            placeholder="John Doe"
            value={formData.guestName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Booking Method</label>
          <select
            name="bookingMethod"
            value={formData.bookingMethod}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100"
          >
            <option value="online">Online</option>
            <option value="phone">Phone</option>
            <option value="walk-in">Walk-in</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Room No/Type</label>
          <input
            type="text"
            name="roomType"
            placeholder="Room 01 (Standard)"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-bold">No of Guest</label>
          <input
            type="number"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Check in Date</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Check out Date</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">
            Booking Date & Time
          </label>
          <input
            type="text"
            name="bookingDateTime"
            value={formData.bookingDateTime}
            disabled
            className="w-full px-4 py-2 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
          >
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Booking Status</label>
          <select
            name="bookingStatus"
            value={formData.bookingStatus}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
          >
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Assigned By</label>
          <input
            type="text"
            name="assignedBy"
            placeholder="admin"
            value={formData.assignedBy}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-1">Special Note</label>
          <input
            type="text"
            name="specialNote"
            placeholder="Guest special note"
            value={formData.specialNote}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-100"
          onClick={() => console.log("Cancelled")}
        >
          Cancel
        </button>
        <button
          className={`px-6 py-2 rounded-md ${
            isSubmitting ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
          } text-white`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}

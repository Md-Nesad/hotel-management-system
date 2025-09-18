// import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Pencil, X } from "lucide-react";
import ReservationStatus from "./StatusUpdate";
import { useState } from "react";

import ViewDetailsModal from "./ViewDetailsModal";
import ReservationNote from "./ReservationNote";

type Room = {
  bed_size: string;
  beds: string;
  baths: string;
  price: number;
  name: string;
  amenities: string[];
};
interface Card {
  cardHolderName: string;
  cardType: string;
  expiration: string;
  last4Digits: string;
}
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
  country: string;
  card: Card;
  price: number;
  source: string;
  amenities: string[];
};
const CheckOutReservation = ({
  bookings,
  onDelete,
}: {
  bookings: Booking[];
  onDelete: (id: string) => void;
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  //view modal
  const openViewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="relative text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl">
      <div>
        <table className="min-w-full border border-gray-300 text-xs bg-white rounded-xl overflow-y-visible">
          <thead className="text-[14px] text-[#00000080]">
            <tr>
              {[
                "Check In-Out",
                "Guest",
                "Phone",
                "Email",
                "Confirmation Number",
                "Room No/ Bed Size",
                "Beds /Bath",
                "Check In/Out Time",
                "Duration",
                "Price / Discount",
                "Source",
                "Amenities",
                "Action",
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
            {bookings.length > 0 ? (
              bookings.map((reser, index: number) => (
                <tr
                  key={index}
                  className="border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]"
                >
                  <td className="border border-gray-200 px-1 w-[200px] 2xl:w-[110px]">
                    <span className=" rounded-full text-16 ">
                      <ReservationStatus bookingId={reser._id} />
                    </span>
                  </td>
                  <td className="border border-gray-200 px-1 py-2">
                    {reser.firstName} <br /> {reser.lastName}
                  </td>

                  <td className="border border-gray-200 px-1 py-2 w-[90px]">
                    {reser.phone.slice(0, 6) + " " + reser.phone.slice(7) ||
                      "N/A"}
                  </td>
                  <td className="border border-gray-200 px-1 py-2">
                    {reser.email ? (
                      <>
                        {reser.email.split("@")[0]}@
                        <br />
                        {reser.email.split("@")[1]}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border border-gray-200 px-1 py-2 w-[50px]">
                    {reser.confirmationNumber.slice(0, 12) || "N/A"}
                  </td>
                  <td className="border border-gray-200 px-1 py-2 lg:w-[1400px] 2xl:w-[250px]">
                    {reser.room?.bed_size || "Queen Bed"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 w-[550px] 2xl:w-[250px]">
                    <p>
                      {reser.room?.beds ? `${reser.room?.beds} Beds` : "N/A"}
                    </p>
                    <p>
                      {reser.room?.baths ? `${reser.room?.baths} Baths` : "N/A"}
                    </p>
                  </td>
                  <td className="border border-gray-200 px-1 py-2 w-[2000px] 2xl:w-[250px] text-[12px]">
                    {reser.checkOut
                      ? new Date(reser.checkOut).toISOString().split("T")[0]
                      : "N/A"}
                    :4pm <br />{" "}
                    {reser.checkIn
                      ? new Date(reser.checkIn).toISOString().split("T")[0]
                      : "N/A"}
                    :11am
                  </td>
                  <td className="border border-gray-200 pl-2 py-2 mr-3">
                    {reser.checkIn && reser.checkOut
                      ? `${Math.ceil(
                          (new Date(reser.checkOut).getTime() -
                            new Date(reser.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : "N/A"}
                  </td>
                  <td className="border border-gray-200 pl-2 py-2 mr-3 w-[70px] 2xl:w-[100px]">
                    <span className="line-through">
                      {Math.ceil(reser.room?.price * 1.333333).toLocaleString()}
                      Fr
                    </span>{" "}
                    <br />
                    <span>{reser.room?.price.toLocaleString()}Fr</span>
                  </td>
                  <td className="border border-gray-200 pl-2 py-2 mr-3">
                    {reser.source || "walk in"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 w-[100px">
                    {reser.room?.amenities.toString().slice(0, 9) || "N/A"}..
                  </td>
                  <td className="border border-gray-200 px-2 py-2 space-x-2 ">
                    <div className="flex flex-col space-x-2">
                      <button
                        title="view reservation details"
                        onClick={() => openViewModal(reser)}
                        className="bg-[#A4A4A4] p-1 text-center w-[57px] rounded-xs text-[12px] mb-1 cursor-pointer"
                      >
                        view all
                      </button>

                      <div className="flex flex-row space-x-2 relative">
                        <button
                          title="change reservation status"
                          onClick={() =>
                            setActiveModalId((prevId) =>
                              prevId === reser._id ? null : reser._id
                            )
                          }
                          className="text-black bg-gray-300 p-1 cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>

                        {activeModalId === reser._id && (
                          <div className="absolute top-8 right-13 z-20 w-53 rounded-lg border border-gray-300 bg-white shadow-lg">
                            <div className="px-3 py-4 mx-auto">
                              <p className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1 border-gray-200">
                                Change Reservation Status
                              </p>
                              <div className="text-sm text-gray-600 space-y-1 ">
                                <ReservationNote bookingId={reser._id} />
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => onDelete(reser._id)}
                          title="delete"
                          className="text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs cursor-pointer"
                        >
                          <X size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  No check out reservation found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        booking={selectedBooking}
      />
    </div>
  );
};

export default CheckOutReservation;

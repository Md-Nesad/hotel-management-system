import React, { useEffect } from "react";
import {
  TotalRoomsIcon,
  OnlineBookingIcon,
  PhoneBookingIcon,
  PersonBookingIcon,
  CheckInIcon,
  CheckOutIcon,
  TotalCustomerIcon,
  TotalConciergeIcon,
  TotalCancelationIcon,
  TotalupComingEvents,
  TotalPromoCode,
  TotalReviews,
  TotalNews,
  AvaliableIcon,
  UnAvaliableIcon,
} from "../Icon/SvgIcon";

import BookingTrendChart from "./ui/BookingTrendChart";
import RoomTypeOccupancyChart from "./ui/RoomTypeOccupancyChart";
import IncomeOverTimeChart from "./ui/IncomeOverTimeChart";
import TopGuests from "./ui/TopGuests";
import IncomeTable from "./ui/IncomeTable";
import { useData } from "../../context/DynamicContext";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor?: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm flex items-center">
    <div className={`p-3 rounded-lg`}>
      <span className="text-white">{icon}</span>
    </div>
    <div>
      <p className="text-[16px] text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-500">{value}</p>
    </div>
  </div>
);

const getStatIcon = (key: string) => {
  const icons: Record<string, { icon: React.ReactElement; color?: string }> = {
    totalRooms: { icon: <TotalRoomsIcon /> },
    onlineBooking: { icon: <OnlineBookingIcon /> },
    phoneBooking: { icon: <PhoneBookingIcon /> },
    personBooking: { icon: <PersonBookingIcon /> },
    checkIn: { icon: <CheckInIcon /> },
    checkOut: { icon: <CheckOutIcon /> },
    dirty: { icon: <AvaliableIcon /> },
    clean: { icon: <UnAvaliableIcon /> },
    totalCustomer: { icon: <TotalCustomerIcon /> },
    totalConcierge: { icon: <TotalConciergeIcon /> },
    totalCancelation: { icon: <TotalCancelationIcon /> },
    upComingEvents: { icon: <TotalupComingEvents /> },
    totalPromoCode: { icon: <TotalPromoCode /> },
    totalReviees: { icon: <TotalReviews /> },
    totalNews: { icon: <TotalNews /> },
  };
  return icons[key] || { icon: <span>📊</span> };
};

const getStatLabel = (key: string): string => {
  const labels: Record<string, string> = {
    totalRooms: "Total Rooms",
    onlineBooking: "Online Booking",
    phoneBooking: "Phone Booking",
    personBooking: "Walk-In Booking",
    checkIn: "Check In",
    checkOut: "Check Out",
    dirty: "Unavailable Room",
    clean: "Avaliable Room",
    totalCustomer: "Total Customer",
    totalConcierge: "Total Concierge",
    totalCancelation: "Total Cancelation",
    upComingEvents: "Upcoming Events",
    totalPromoCode: "Total Promo Code",
    totalReviees: "Reviews",
    totalNews: "News",
  };
  return labels[key] || key;
};

const DashboardAnalysis = () => {
  const {
    rooms,
    booking,
    employee,
    cancelled,
    events,
    promo,
    reviews,
    refresh,
  } = useData();

  useEffect(() => {
    refresh();
  }, []);

  const availableRooms = rooms?.filter(
    (room: any) => room?.status === "Available"
  );
  const unavailableRooms = rooms?.filter(
    (room: any) => room?.status === "Unavailable"
  );

  const news = events.filter((event: any) => event.content === "news");

  const stats = {
    totalRooms: rooms.length,
    onlineBooking: booking.length,
    phoneBooking: 0,
    personBooking: 0,
    checkIn: booking.length,
    checkOut: 0,
    dirty: unavailableRooms.length,
    clean: availableRooms.length,
    totalCustomer: booking.length,
    totalConcierge: employee.length,
    totalCancelation: cancelled.length,
    upComingEvents: events.length,
    totalPromoCode: promo.length,
    totalReviees: reviews.length,
    totalNews: news.length,
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white py-2 px-8 rounded-lg shadow-[0_0_3px_rgba(0,0,0,0.25)] border-gray-300 mb-4 ">
        <h2 className="text-xl text-orange-400 font-semibold py-1">
          OVERVIEW DASHBOARD
        </h2>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-6">
            {Object.entries(stats).map(([key, value]) => {
              const { icon, color } = getStatIcon(key);
              return (
                <StatCard
                  key={key}
                  icon={icon}
                  label={getStatLabel(key)}
                  value={value}
                  bgColor={color}
                />
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-x-4 gap-y-6 mt-6">
            {/* Booking Trend (3/4) + Room Type (1/4) */}
            <div className="xl:col-span-3">
              <BookingTrendChart />
            </div>

            <div className="xl:col-span-1">
              <RoomTypeOccupancyChart />
            </div>

            <div className="xl:col-span-4">
              <IncomeTable />
            </div>

            {/* Income Over Time (3/4) + Top Guests (1/4) */}
            <div className="xl:col-span-3">
              <IncomeOverTimeChart />
            </div>
            <div className="xl:col-span-1">
              <TopGuests />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAnalysis;

import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { MdCancel, MdOutlineCelebration } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { AiOutlineSound } from "react-icons/ai";
import { PiHandSwipeLeft } from "react-icons/pi";
import { FaPeopleGroup, FaBed, FaUserTie } from "react-icons/fa6";
import { SiSimpleanalytics } from "react-icons/si";
import { Settings } from "lucide-react";
import Profile from "../components/icons/userProfile";
import HouseKeeper from "../components/icons/HouseKeeper";
import Reservation from "../components/icons/Reservation";
import { useAuth } from "../context/AuthContext";

interface FeatureAccess {
  generalOperationManagement?: boolean;
  bookingManagement?: boolean;
  reservationManagement?: boolean;
  houseKeepingManagement?: boolean;
  guestInformationManagement?: boolean;
  staffRoleManagement?: boolean;
  eventManagement?: boolean;
  marketingOfferManagement?: boolean;
  reputationManagement?: boolean;
  roomManagement?: boolean;
  reportingDataManagement?: boolean;
}

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ReactElement;
  match?: string[];
  featureKey?: keyof FeatureAccess;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  console.log("user", user);
  const location = useLocation();

  const featureAccess: FeatureAccess = user?.featureAccess || {};

  const showRoomMenuRoutes = [
    "/dashboard",
    "/dashboard/overview",
    "/dashboard/room",
    "/dashboard/available",
    "/dashboard/unavailable",
  ];

  const sidebarLinks: SidebarLink[] = [
    {
      name: "Front Desk",
      path: "/dashboard/room",
      icon: <Profile />,
      match: showRoomMenuRoutes,
      featureKey: "generalOperationManagement",
    },
    {
      name: "Booking",
      path: "/dashboard/dashboard_booking",
      icon: <PiHandSwipeLeft />,
      featureKey: "bookingManagement",
    },
    {
      name: "Cancelation",
      path: "/dashboard/cancelation",
      icon: <MdCancel className="p-3" />,
      featureKey: "reservationManagement",
    },
    {
      name: "Reservation",
      path: "/dashboard/reservation",
      icon: <Reservation />,
      featureKey: "reservationManagement",
    },
    {
      name: "Housekeeping",
      path: "/dashboard/housekeeping",
      icon: <HouseKeeper />,
      featureKey: "houseKeepingManagement",
    },
    {
      name: "Guest List",
      path: "/dashboard/guests",
      icon: <GoPeople />,
      featureKey: "guestInformationManagement",
    },
    {
      name: "Concierge List",
      path: "/dashboard/concierge",
      icon: <FaUserTie />,
      featureKey: "staffRoleManagement",
    },
    {
      name: "Events",
      path: "/dashboard/events",
      icon: <MdOutlineCelebration />,
      featureKey: "eventManagement",
    },
    {
      name: "Promo Code",
      path: "/dashboard/promotion",
      icon: <AiOutlineSound />,
      featureKey: "marketingOfferManagement",
    },
    {
      name: "Reviews",
      path: "/dashboard/reviews",
      icon: <FaPeopleGroup />,
      featureKey: "reputationManagement",
    },
    {
      name: "Add New Room",
      path: "/dashboard/room_list",
      icon: <FaBed />,
      featureKey: "roomManagement",
    },
    {
      name: "Analysis",
      path: "/dashboard/dashboardanalysis",
      icon: <SiSimpleanalytics />,
      featureKey: "reportingDataManagement",
    },
    {
      name: "Settings",
      path: "/dashboard/profile",
      icon: <Settings />,
      match: [
        "/dashboard/profile",
        "/dashboard/page_management",
        "/dashboard/employee_and_housekeeper_management",
      ],
      featureKey: "generalOperationManagement",
    },
  ];

  const shouldShowTopMenu = showRoomMenuRoutes.includes(location.pathname);

  return (
    <div className="flex mt-18 min-h-screen pb-5">
      {/* Sidebar */}
      <aside className="w-64 bg-white pr-6 border shadow border-gray-200">
        <nav className="fixed">
          {sidebarLinks.map(({ name, path, icon, match, featureKey }) => {
            const isMatched = match
              ? match.includes(location.pathname)
              : location.pathname === path;

            // যদি array হয় (signup এর পর), disable হবে না
            const isFeatureAccessArray = Array.isArray(featureAccess);

            const isDisabled =
              featureKey &&
              user?.role !== "admin" &&
              !isFeatureAccessArray &&
              !featureAccess[featureKey];

            return (
              <NavLink
                key={path}
                to={isDisabled ? "#" : path}
                className={`flex items-center py-[6.5px] mt-[7px] px-12 pl-7 text-md rounded-r-lg font-semibold
      ${isMatched && !isDisabled ? "bg-orange-400 text-white" : "text-gray-700"}
      ${isDisabled ? "pointer-events-none opacity-50" : "hover:bg-orange-500"}`}
              >
                {React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement<any>, {
                      className: `w-5 h-5 mr-4 ${
                        isDisabled ? "text-gray-400" : "text-gray-500"
                      }`,
                    })
                  : icon}
                {name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-1 bg-gray-50">
        {/* Top Horizontal Menu */}
        {shouldShowTopMenu && (
          <div className="flex items-center mb-6 bg-white shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg px-8 pt-5 pb-4 gap-x-10">
            {[
              { name: "ALL ROOMS", path: "/dashboard/room" },
              { name: "AVAILABLE", path: "/dashboard/available" },
              { name: "UNAVAILABLE", path: "/dashboard/unavailable" },
            ].map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `relative text-center transition duration-200 text-md font-extrabold ${
                    isActive
                      ? 'text-orange-500 after:content-[""] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-28 after:h-[2px] after:bg-orange-500'
                      : "text-[#00000080]"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>
        )}

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

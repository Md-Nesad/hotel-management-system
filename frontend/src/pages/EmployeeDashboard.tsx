import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { AiOutlineSound } from "react-icons/ai";
import { PiHandSwipeLeft } from "react-icons/pi";

const EmployeeDashboard = () => {
  const location = useLocation();
  const sidebarLinks = [
    { name: "Overview", path: "emp-overview", icon: <BiCategory /> },
    {
      name: "Room List",
      path: "emp-roomlist",
      icon: <MdOutlineBedroomChild />,
    },
    { name: "Guest List", path: "emp-guestlist", icon: <GoPeople /> },
    { name: "Promotion", path: "emp-promotion", icon: <AiOutlineSound /> },
    { name: "Booking", path: "emp-booking", icon: <PiHandSwipeLeft /> },
  ];

  const showRoomMenuRoutes = [
    "/employee-dashboard",
    "/employee-dashboard/emp-overview",
    "/employee-dashboard/emp-room",
    "/employee-dashboard/emp-available",
    "/employee-dashboard/emp-booked",
  ];

  const shouldShowTopMenu = showRoomMenuRoutes.includes(location.pathname);

  return (
    <div className="flex mt-20 min-h-screen pb-5">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border shadow border-gray-200 rounded-xl">
        <nav className="space-y-2">
          {sidebarLinks.map(({ name, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-base font-medium rounded hover:bg-orange-100 ${
                  isActive
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700"
                }`
              }
            >
              {React.cloneElement(icon, { className: "w-5 h-5 mr-2" })}
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-1 bg-gray-50">
        {/* Top Horizontal Menu */}
        {shouldShowTopMenu && (
          <div className="flex items-center mb-6 bg-white shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg px-4 pt-5 pb-4 gap-x-10">
            {[
              { name: "All Rooms", path: "/employee-dashboard/emp-room" },
              { name: "Available", path: "/employee-dashboard/emp-available" },
              { name: "Booked", path: "/employee-dashboard/emp-booked" },
            ].map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `relative text-center transition duration-200 text-2xl font-extrabold ${
                    isActive
                      ? 'text-orange-500 after:content-[""] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-25 after:h-[1px] after:bg-orange-500'
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

export default EmployeeDashboard;

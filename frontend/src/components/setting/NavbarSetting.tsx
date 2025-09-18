import { NavLink } from "react-router-dom";

export default function NavbarSetting() {
  const navItems = [
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Page Management", path: "/dashboard/page_management" },
    {
      name: "Employee & Housekeeper Management",
      path: "/dashboard/employee_and_housekeeper_management",
    },
  ];

  return (
    <div>
      <div className="flex items-center mb-6 bg-white shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg px-8 pt-5 pb-4 gap-x-10">
        {navItems.map(({ name, path }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `relative text-center transition duration-200 text-md font-extrabold ${
                isActive ? "text-orange-500" : "text-[#00000080]"
              }`
            }
          >
            {({ isActive }) => (
              <span className="relative inline-block">
                {name}
                {isActive && (
                  <span
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 h-[2px]"
                    style={{
                      width: `${name.length * 9}px`,
                    }}
                  />
                )}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import logotwo from "../../../assets/bahamas-logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const DashboardMenu = () => {
  const [lastProfile, setLastProfile] = useState<any>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleLogoutOpen = () => {
    setIsLogoutOpen(!isLogoutOpen);
  };

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const res = await fetch(
          "https://backend.bahamaslrb.com/api/profile/all"
        );
        const data = await res.json();
        setLastProfile(data[data.length - 1]);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    handleFetch();
  }, []);

  return (
    <header className="w-full bg-[#000000] shadow-sm border-b border-gray-100 fixed top-0 z-50">
      <div className="w-full mx-auto px-10 sm:px-20">
        <div className="flex justify-between items-center">
          {/* logo */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard/room" className="flex items-center">
              <img
                src={logotwo}
                alt="Bahamas Logo"
                className="h-9 sm:h-14 bg-black object-contain mt-2 sm:mt-0 rounded"
              />
            </Link>
          </div>
          {/* <div>
            <Link to="/">home</Link>
          </div> */}
          <div className="flex items-center gap-6">
            <h2 className="text-white font-semibold">BahamasLRB Admin</h2>
            <div onClick={toggleLogoutOpen}>
              <img
                src={`https://backend.bahamaslrb.com/uploads/${lastProfile?.profileImage}`}
                alt="Admin icon"
                className="w-10 h-10 rounded-full border border-white cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      {isLogoutOpen && (
        <div className="absolute top-16 right-5.5 w-52 bg-white shadow-xl rounded-lg py-3 z-50 border border-gray-200">
          <Link
            to="/"
            className={`${
              location.pathname === "/"
                ? "block px-4 py-2 text-[var(--color-orange)] font-medium bg-gray-50"
                : "block px-4 py-2 text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-100"
            } transition duration-200`}
          >
            Lodge
          </Link>

          <Link
            to="/resturant-bar"
            className={`${
              location.pathname === "/resturant-bar"
                ? "block px-4 py-2 text-[var(--color-orange)] font-medium bg-gray-50"
                : "block px-4 py-2 text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-100"
            } transition duration-200`}
          >
            Restaurant & Bar
          </Link>
          <div className="px-4 pt-2 flex flex-col space-y-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className={`${
                  location.pathname === "/login"
                    ? "text-[var(--color-orange)] font-medium"
                    : "text-black"
                } hover:text-[var(--color-gold)] font-inter transition-colors duration-200 text-start cursor-pointer`}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`${
                  location.pathname === "/login"
                    ? "text-[var(--color-orange)] font-medium"
                    : "text-black"
                } hover:text-[var(--color-gold)] font-inter transition-colors duration-200 text-start cursor-pointer`}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardMenu;

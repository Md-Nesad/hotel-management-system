import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface FeatureAccess {
  generalOperationManagement: boolean;
  bookingManagement: boolean;
  reservationManagement: boolean;
  houseKeepingManagement: boolean;
  guestInformationManagement: boolean;
  staffRoleManagement: boolean;
  eventManagement: boolean;
  marketingOfferManagement: boolean;
  reputationManagement: boolean;
  roomManagement: boolean;
  reportingDataManagement: boolean;
}

interface User {
  id: string;
  username: string;
  role: string;
  featureAccess: FeatureAccess;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (data: any) => {
    console.log("data", data);
    const { access_token, user } = data;

    const userData: User = {
      id: user.id,
      username: user.username,
      role: user.role,
      featureAccess: user.featureAccess,
    };

    setUser(userData);
    setToken(access_token);

    // localStorage save
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      if (!token) return;
      const confirm = window.confirm("Are you sure you want to logout?");
      if (!confirm) return;

      await fetch("https://backend.bahamaslrb.com/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

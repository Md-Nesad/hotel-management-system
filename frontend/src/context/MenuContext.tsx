import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
// Define type based on your JSON
export interface MenuBlock {
  title?: string;
  subtitle?: string;
}

interface MenuBlockContextType {
  menuBlocks: MenuBlock;
  loading: boolean;
  error: string | null;
}

const MenuBlockContext = createContext<MenuBlockContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export const MenuBlockProvider: React.FC<ProviderProps> = ({ children }) => {
  const [menuBlocks, setMenuBlocks] = useState<MenuBlock>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuBlocks = async () => {
      try {
        const res = await fetch(
          "https://backend.bahamaslrb.com/api/menuBlock/all"
        );
        if (!res.ok) throw new Error("Failed to fetch menu block data");

        const json = await res.json();
        const data = json.data;
        setMenuBlocks(data[data.length - 1]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuBlocks();
  }, []);

  return (
    <MenuBlockContext.Provider value={{ menuBlocks, loading, error }}>
      {children}
    </MenuBlockContext.Provider>
  );
};

export const useMenuBlocks = (): MenuBlockContextType => {
  const context = useContext(MenuBlockContext);
  if (!context) {
    throw new Error("useMenuBlocks must be used within a MenuBlockProvider");
  }
  return context;
};

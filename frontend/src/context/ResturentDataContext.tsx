import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface FoodData {
  _id: string;
  headerImage: string;
  title: string;
  title1: string;
  subTitle: string;
  img1: string;
  price1: number;
  title2: string;
  img2: string;
  price2: number;
  title3: string;
  img3: string;
  price3: number;
  createdAt: string;
  updatedAt: string;
}

interface FoodContextType {
  foodData: FoodData | null;
  loading: boolean;
  error: string | null;
}

const FoodDataContext = createContext<FoodContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const FoodDataProvider: React.FC<ProviderProps> = ({ children }) => {
  const [foodData, setFoodData] = useState<FoodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const res = await fetch("https://backend.bahamaslrb.com/api/food/all");
        if (!res.ok) throw new Error("Failed to fetch food data");
        const data: FoodData = await res.json(); // assuming API returns single object
        setFoodData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, []);

  return (
    <FoodDataContext.Provider value={{ foodData, loading, error }}>
      {children}
    </FoodDataContext.Provider>
  );
};

export const useFoodData = (): FoodContextType => {
  const context = useContext(FoodDataContext);
  if (!context) {
    throw new Error("useFoodData must be used within a FoodDataProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
// Define type based on your JSON
export interface PageData {
  _id: string;
  location: string;
  phoneNumber: string;
  img1: string;
  img1Title: string;
  button1: string;
  img2: string;
  img2Title: string;
  button2: string;
  img3: string;
  img3Title: string;
  button3: string;
  roomTitle: string;
  roomSubTitle: string;
  roomButton: string;
  amenitiesTitle: string;
  amenitiesSubTitle: string;
  eventTitle: string;
  eventSubTitle: string;
  reviewsTitle: string;
  reviewsSubTitle: string;
  createdAt: string;
  updatedAt: string;
}

interface PageDataContextType {
  pageData: PageData | null;
  loading: boolean;
  error: string | null;
}

const PageDataContext = createContext<PageDataContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export const PageDataProvider: React.FC<ProviderProps> = ({ children }) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch("https://backend.bahamaslrb.com/api/page/all");
        if (!res.ok) throw new Error("Failed to fetch page data");
        const data: PageData = await res.json(); // Single object
        setPageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  return (
    <PageDataContext.Provider value={{ pageData, loading, error }}>
      {children}
    </PageDataContext.Provider>
  );
};

export const usePageData = (): PageDataContextType => {
  const context = useContext(PageDataContext);
  if (!context) {
    throw new Error("usePageData must be used within a PageDataProvider");
  }
  return context;
};

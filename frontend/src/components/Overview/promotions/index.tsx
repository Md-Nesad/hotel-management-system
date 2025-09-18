import * as Tabs from "@radix-ui/react-tabs";
import { Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllPromotionList from "./AllPromotion";
import ActivePromo from "./ActivePromo";
import InActivePromo from "./InActivePromp";
import axios from "axios";

interface Promotion {
  _id: string;
  promoTitle: string;
  startDate: string;
  endDate: string;
  promoCode: string;
  discount: number;
  status: string;
}

export default function ReservationTabs() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated!");
        return;
      }
      const res = await fetch("https://backend.bahamaslrb.com/promotion/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch promotions");
      }

      const data: Promotion[] = await res.json();
      setPromotions(data);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  //handle delete
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this promo code?"
    );
    if (!confirmed) return; // User canceled
    try {
      await axios.delete(`https://backend.bahamaslrb.com/promotion/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Promotion deleted successfully!");
      setPromotions(promotions.filter((promo) => promo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center ">Loading...</div>;

  return (
    <div>
      {/* Tabs */}
      <Tabs.Root defaultValue="allPromotion">
        <Tabs.List className="text-[16px] font-bold flex gap-x-4 items-center border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)] mb-4">
          <Tabs.Trigger
            value="allPromotion"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            ALL PROMOTION
          </Tabs.Trigger>
          <Tabs.Trigger
            value="events"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            ACTIVE
          </Tabs.Trigger>
          <Tabs.Trigger
            value="news"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            INACTIVE
          </Tabs.Trigger>

          <div className="sm:ml-auto sm:mr-10">
            <button
              onClick={() => navigate("add-promo-code")}
              className="border bg-gray-400 py-2 px-3 rounded-md cursor-pointer hover:bg-orange-400 text-white hover:border-orange-400 transition-colors duration-300"
            >
              + Add New Coupon
            </button>
          </div>
        </Tabs.List>

        <Box pt="2">
          <Tabs.Content value="allPromotion">
            <AllPromotionList
              promotion={promotions}
              error={error}
              onDelete={handleDelete}
            />
          </Tabs.Content>
          <Tabs.Content value="events">
            <ActivePromo
              promotion={promotions.filter((p) => p.status === "active")}
              error={error}
              onDelete={handleDelete}
            />
          </Tabs.Content>
          <Tabs.Content value="news">
            <InActivePromo
              promotion={promotions.filter((p) => p.status === "inactive")}
              error={error}
              onDelete={handleDelete}
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

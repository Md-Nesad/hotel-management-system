import * as Tabs from "@radix-ui/react-tabs";
import { Box } from "@radix-ui/themes";
import HouseKeeper from "./HouseKeeper";
import Cleaned from "./Cleaned";
import Dirty from "./Dirty";
import OnHold from "./OnHold";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HouseKeeperTabs() {
  const [houseKeeper, setHouseKeeper] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchHousekeeping = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://backend.bahamaslrb.com/housekeeping"
      );
      setHouseKeeper(response.data);
    } catch (error) {
      console.error("Failed to fetch housekeeping data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHousekeeping();
  }, []);

  //handle delete
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this housekeeping?"
    );
    if (!confirmed) return; // User canceled
    try {
      await axios.delete(`https://backend.bahamaslrb.com/housekeeping/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Housekeeping deleted successfully!");
      setHouseKeeper(houseKeeper.filter((book) => book._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center pt-5">Loading...</div>;
  }
  return (
    <div>
      {/* Tabs */}
      <Tabs.Root defaultValue="housekeeper">
        <Tabs.List className="text-[15px] font-bold flex gap-x-4 items-center border-b py-3 bg-white pl-10 border-gray-300 rounded-md shadow-[0_0_3px_rgba(0,0,0,0.25)] mb-4">
          <Tabs.Trigger
            value="housekeeper"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            HOUSEKEEPER
          </Tabs.Trigger>
          <Tabs.Trigger
            value="cleaned"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            CLEANED
          </Tabs.Trigger>
          <Tabs.Trigger
            value="dirty"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            DIRTY
          </Tabs.Trigger>
          <Tabs.Trigger
            value="onHolder"
            className="cursor-pointer focus:border-b-2 focus:text-[#F9862D] focus:pb-1"
          >
            ONHOLDER
          </Tabs.Trigger>

          <div className="sm:ml-auto sm:mr-10">
            <button
              onClick={() => navigate("/dashboard/add_housekeeper")}
              className="border bg-gray-400 text-white py-2 px-3 rounded-md cursor-pointer hover:bg-orange-400 hover:text-white hover:border-orange-400 transition-colors duration-300"
            >
              + Add Housekeeper
            </button>
          </div>
        </Tabs.List>

        <Box pt="2">
          <Tabs.Content value="housekeeper">
            <HouseKeeper
              houseKeeper={houseKeeper}
              onDelete={handleDelete}
              onRefresh={fetchHousekeeping}
            />
          </Tabs.Content>
          <Tabs.Content value="cleaned">
            <Cleaned
              houseKeeper={houseKeeper.filter((h) => h.status === "Clean")}
              onDelete={handleDelete}
              onRefresh={fetchHousekeeping}
            />
          </Tabs.Content>
          <Tabs.Content value="dirty">
            <Dirty
              houseKeeper={houseKeeper.filter((h) => h.status === "Dirty")}
              onDelete={handleDelete}
              onRefresh={fetchHousekeeping}
            />
          </Tabs.Content>
          <Tabs.Content value="onHolder">
            <OnHold
              houseKeeper={houseKeeper.filter((h) => h.status === "OnHold")}
              onDelete={handleDelete}
              onRefresh={fetchHousekeeping}
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

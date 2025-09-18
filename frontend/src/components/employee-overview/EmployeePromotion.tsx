import React, { useEffect, useState } from "react";

interface Promotion {
  promoTitle: string;
  startDate: string;
  endDate: string;
  promoCode: string;
  discount: number;
  status: string;
}

const PromotionList: React.FC = () => {
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
      const res = await fetch("http://185.170.58.79:5000/promotion/all", {
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

  return (
    <div>
      <div className="flex justify-between items-center px-4 bg-white text-gray-700 shadow-sm rounded-md mb-4 py-4">
        <h2 className=" text-gray-700 font-bold">Promotion List</h2>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left bg-white text-gray-700">
            <thead className=" py-5">
              <tr className="border border-gray-300">
                <th className="px-4 py-3 border border-gray-300">
                  Coupon Code
                </th>
                <th className="px-4 py-3 border border-gray-300">Discount</th>
                <th className="px-4 py-3 border border-gray-300">Valid Till</th>
                <th className="px-4 py-3 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo, i) => (
                <tr key={i} className="border border-gray-300">
                  <td className="px-4 py-3 border border-gray-300">
                    {promo.promoCode}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {promo.discount || 10}%
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {new Date(promo.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 capitalize">
                    {promo.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          )}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default PromotionList;

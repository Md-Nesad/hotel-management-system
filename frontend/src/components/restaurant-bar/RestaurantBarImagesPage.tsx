import React from "react";
import { useFoodData } from "../../context/ResturentDataContext";

const RestaurantBarImagesPage: React.FC = () => {
  const { foodData } = useFoodData();
  if (!foodData) return <p>No data found</p>;
  return (
    <div className="bg-white pb-12">
      <div className="w-full max-w-[1062px] mx-auto pt-36 max-sm:pt-10">
        <img
          src={`https://backend.bahamaslrb.com/uploads/${foodData.headerImage}`}
          alt="Cold Drinks Image Gallery"
          className="w-full h-[480px] object-cover bg- rounded-md"
        />
      </div>
    </div>
  );
};

export default RestaurantBarImagesPage;

import React, { useEffect, useState } from "react";
import { useFoodData } from "../../context/ResturentDataContext";

interface FoodItem {
  name: string;
  price: number;
  image: string;
}

const FoodList: React.FC = () => {
  const { foodData } = useFoodData();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const baseUrl = "https://backend.bahamaslrb.com/uploads/";

  useEffect(() => {
    if (!foodData) return;
    const newSlides = [
      {
        image: baseUrl + foodData.img1,
        name: foodData.title1,
        price: foodData.price1,
      },
      {
        image: baseUrl + foodData.img2,
        name: foodData.title2,
        price: foodData.price2,
      },
      {
        image: baseUrl + foodData.img3,
        name: foodData.title3,
        price: foodData.price3,
      },
    ];
    setFoods(newSlides as unknown as FoodItem[]);
  }, [foodData]);

  return (
    <div className="bg-black py-12 text-white text-center">
      <h2 className="text-2xl font-bold mb-2">{foodData?.title}</h2>
      <p className="text-gray-300 mb-10">{foodData?.subTitle}</p>

      <div className="flex justify-center gap-7 flex-wrap px-4">
        {foods?.map((food, index) => (
          <div
            key={index}
            className="bg-black border border-gray-600 rounded-md overflow-hidden shadow-md w-[330px] relative"
          >
            <div className="h-48 w-full overflow-hidden relative group">
              <img
                src={
                  food?.image?.startsWith("http")
                    ? food?.image
                    : `${baseUrl}${food?.image}`
                }
                alt={food.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <span className="absolute top-2 left-2 bg-[#ffffffc9] text-[#000000] text-sm font-semibold px-2 py-1 rounded">
                {food.price.toLocaleString()}Fr
              </span>
            </div>
            <div className="py-5 text-center text-white font-semibold text-lg">
              {food.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;

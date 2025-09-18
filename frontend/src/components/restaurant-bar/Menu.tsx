import React, { useEffect, useState } from "react";
import { useMenuBlocks } from "../../context/MenuContext";

interface MenuItem {
  name: string;
  price: string;
  option?: string;
}

interface MenuSection {
  title: string;
  image: string;
  items: MenuItem[];
  layout: string;
  alt: string;
}

const MenuPage: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { menuBlocks } = useMenuBlocks();

  const handleGetData = async () => {
    try {
      const res = await fetch(
        "https://backend.bahamaslrb.com/api/menuSection/all"
      );
      const data = await res.json();

      const recentFive = data
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      const formattedData: MenuSection[] = recentFive.map(
        (section: any, index: number) => ({
          title: section.title || "Untitled Section",
          image: section.image,
          items: section.items || [],
          layout: index % 2 === 0 ? "right" : "left",
          alt: section.title || "menu section",
        })
      );

      setMenuData(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // loading শেষ হলে false করবো
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className=" text-[#000000] px-4 sm:px-8 lg:px-28 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold">
          {menuBlocks?.title || "Loading..."}
        </h1>
        <p className="mt-4 text-lg sm:text-xl lg:text-lg">
          {menuBlocks?.subtitle || "Please wait while we load the menu"}
        </p>
      </div>

      {/* Loading Effect */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="w-12 h-12 border-4 border-[#F65500] border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-10 w-full max-w-4xl">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col lg:flex-row items-center gap-8"
              >
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                    <div className="h-4 w-52 bg-gray-200 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-56 h-56 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-20 max-w-5xl mx-auto">
          {menuData.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                item.layout === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center lg:gap-x-[150px]`}
            >
              {/* Text Section */}
              <div
                className={`${
                  item.layout === "right" ? "place-items-end" : ""
                } ${
                  item.layout === "left" ? "place-items-start" : ""
                } space-y-4 max-sm:mb-10`}
              >
                <h2 className="text-lg sm:text-xl md:text-xl font-semibold uppercase bg-[#F65500] text-white px-6 py-2 inline-block rounded">
                  {item.title}
                </h2>
                <div className="space-y-4">
                  {item.items.map((food, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-baseline text-start sm:text-lg md:text-xl gap-4 sm:gap-20"
                    >
                      <p className="min-w-[130px] sm:min-w-[240px] text-[21px] text-[#4a4a4a] font-bold">
                        {food.name.split(/(\(.*?\))/).map((part, index) =>
                          part.startsWith("(") && part.endsWith(")") ? (
                            <span
                              key={index}
                              className="text-gray-400 text-[12px]"
                            >
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )}
                      </p>
                      <span className="font-medium whitespace-nowrap">
                        {food.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Section */}
              <div className="w-full lg:w-1/2 flex">
                <div
                  className={`relative flex w-full max-w-6xl h-64 bg-[#F9862D] shadow-lg ${
                    item.layout === "left"
                      ? "rounded-tl-[120px] rounded-bl-[120px]"
                      : "rounded-tr-[120px] rounded-br-[120px]"
                  }`}
                >
                  <img
                    src={`https://backend.bahamaslrb.com/uploads/${item.image}`}
                    alt={item.alt}
                    className={`w-56 h-56 object-cover rounded-full absolute top-1/2 transform -translate-y-1/2 shadow-lg ${
                      item.layout === "right" ? "right-4" : "left-4"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;

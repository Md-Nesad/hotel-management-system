import MenuListTwo from "./components/ManuListTwo";
import MenuList from "./components/MenuList";
import RoomSetting from "./components/lodgePage/RoomList";
import OurAminities from "./components/lodgePage/ourAminities";
import EventAndNews from "./components/lodgePage/EventAndNews";
import SettingReviews from "./components/lodgePage/ReviewsSetting";
import HeaderImage from "./components/resturentandbar/HeaderImage";
import FoodListSetting from "./components/resturentandbar/FoodListSetting";
import MenuListSetting from "./components/resturentandbar/MenuListSetting";
import Footeepage from "./components/footerSetting/FooterPage";
import FooterContact from "./components/footerSetting/FooterContact";
import WelcomePage from "./components/lodgePage/WelcomePage";
import HeroImageOne from "./components/lodgePage/HeroImageOne";
import HeroImageTwo from "./components/lodgePage/HeroImageTwo";
import HeroImageThree from "./components/lodgePage/HeroImageThree";
import FoodListImageOne from "./components/resturentandbar/FoodListImageOne";
import FoodListImageTwo from "./components/resturentandbar/FoodListImageTwo";
import FoodListImageThree from "./components/resturentandbar/FoodListImageThree";
import { useEffect, useState } from "react";

interface MenuSection {
  title: string;
  image: string;
  layout: string;
  alt: string;
}

const baseUrl = "https://backend.bahamaslrb.com/uploads/";

export default function PageManagement() {
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  console.log(menuData);
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
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <>
      {/* lodge page start */}
      <WelcomePage />
      <HeroImageOne />
      <HeroImageTwo />
      <HeroImageThree />
      <RoomSetting />
      <OurAminities />
      <EventAndNews />
      <SettingReviews /> <br />
      {/* lodge page end */}
      {/* resturent page start */}
      <HeaderImage />
      <FoodListSetting />
      <FoodListImageOne />
      <FoodListImageTwo />
      <FoodListImageThree />
      <MenuListSetting />
      <MenuList image={baseUrl + menuData[0]?.image} />
      <MenuListTwo image={baseUrl + menuData[1]?.image} />
      <MenuListTwo image={baseUrl + menuData[2]?.image} />
      <MenuListTwo image={baseUrl + menuData[3]?.image} />
      <MenuListTwo image={baseUrl + menuData[4]?.image} /> <br />
      {/* resturent page end */}
      <Footeepage />
      <FooterContact />
    </>
  );
}

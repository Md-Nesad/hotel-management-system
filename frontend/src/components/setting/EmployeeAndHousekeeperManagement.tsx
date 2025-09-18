import FeatureAccess from "./components/EmployeeManagement";
import HouseKeeperFeatures from "./components/HouseKeeerManage";
import NavbarSetting from "./NavbarSetting";

export default function EmployeeAndHousekeeperManagement() {
  return (
    <div>
      <NavbarSetting />
      <FeatureAccess /> <br />
      <HouseKeeperFeatures />
    </div>
  );
}

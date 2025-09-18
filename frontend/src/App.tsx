import { Routes, Route, useLocation } from "react-router-dom";
import Lodge from "./pages/lodge";
import RestaurantBarPage from "./pages/restaurant-bar";
import BookingPage from "./pages/booking";
import LoginForm from "./components/Login/Login";
import SignUpForm from "./components/Signup/Signup";
import Dashboard from "./pages/Dashboard";
import BookNow from "./pages/BookNow";
import Overview from "./components/Overview/Overview";
import AllRooms from "./components/Overview/AllRooms";
//import AvailableRooms from './components/Overview/AvailableRooms';

import GuestList from "./components/Overview/GuestList";

import Reviews from "./components/Overview/Reviews";
import DashboardAnalysis from "./components/Overview/DashboardAnalysis";

import ConciergeList from "./components/Overview/ConciergeList";
import AvailableRooms from "./components/Overview/AvailableRooms ";

import RoomDetails from "./components/RoomList/RoomDetails";

import BasicInfo from "./components/Overview/BasicInfo";
import AvailableRoom from "./pages/AvailableRooms";
import PaymentForm from "./components/booking/PaymentForm";
import AddRoom from "./pages/AddRoom";
import UpdateRoom from "./pages/UpdateRoom";

import EditDashBoardBooking from "./components/Overview/EditDashboardBooking";
import FeedbackForm from "./pages/FeedbackForm";
import NotFoundPage from "./pages/NotFound";
import EditBookedRoomDetails from "./components/Overview/EditBookedRoom";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeOverview from "./components/employee-overview/EmployeeOverview";
import EmpRoomList from "./components/employee-overview/EmployeeRoomList";
import EmpGuestList from "./components/employee-overview/EmployeeGuestList";
import EmpPromotionList from "./components/employee-overview/EmployeePromotion";
import EmpDashboardBooking from "./components/employee-overview/EmployeeBooking";
import EmployeeAllRoom from "./components/employee-overview/EmployeeOverview";
import EmpAvailableRooms from "./components/employee-overview/EmployeeAvailable";
import EmpBookedRooms from "./components/employee-overview/EmpBooked";
import UpdateConcierge from "./pages/UpdateConcierge";
import AddPromoCode from "./components/Overview/AddPromoCode";
import EditPromotion from "./components/Overview/EditPromotion";
import CheckStay from "./pages/CheckStay";
import ConfirmRoomDetails from "./pages/ConfirmRoomDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import UnAvailableRooms from "./components/Overview/UnAvailableRoom";
import Booking from "./components/RoomList/Booking";
import AddBookingInformation from "./components/Overview/AddBookingInformation";
import Cancelation from "./components/cancelation";
import Reservation from "./components/reservation";
import HouseKeeping from "./components/houseKeeping";
import AddConcierge from "./components/Overview/AddConcierge";
import EventsTabs from "./components/events";
import Promotions from "./components/Overview/promotions";
import AddEvents from "./components/Overview/AddEvents";
import RoomList from "./components/RoomList";
import Header from "./components/common/header";
import DashboardMenu from "./components/common/header/DashboardNavbar";
import EmployeeAndHousekeeperManagement from "./components/setting/EmployeeAndHousekeeperManagement";
import AdminSettingsPage from "./components/setting/Profile";
import PageManagement from "./components/setting/PageManagement";
import AddHouseKeeper from "./components/houseKeeping/AddHouseKeeper";
import UpdateEvents from "./components/events/UpdateEvents";

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  return (
    <>
      {!isDashboardRoute && <Header />}
      {isDashboardRoute && <DashboardMenu />} {/* create this */}
      <Routes>
        <Route path="/" element={<Lodge />} />
        <Route path="/resturant-bar" element={<RestaurantBarPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/avaliable-rooms" element={<AvailableRoom />} />
        <Route path="/room-details/:id" element={<RoomDetails />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/check-stay" element={<CheckStay />} />
        <Route path="/room-list" element={<ConfirmRoomDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Dashboard nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="room" element={<AllRooms />} />
          <Route path="available" element={<AvailableRooms />} />
          <Route path="unavailable" element={<UnAvailableRooms />} />
          <Route path="dashboard_booking" element={<Booking />} />
          <Route path="add_booking" element={<AddBookingInformation />} />
          <Route path="cancelation" element={<Cancelation />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="housekeeping" element={<HouseKeeping />} />
          <Route path="add_housekeeper" element={<AddHouseKeeper />} />
          <Route path="guests" element={<GuestList />} />
          <Route path="concierge" element={<ConciergeList />} />
          <Route path="addconcierge" element={<AddConcierge />} />
          <Route
            path="updateConcierge/:employeId"
            element={<UpdateConcierge />}
          />
          <Route path="events" element={<EventsTabs />} />
          <Route path="events/add_event" element={<AddEvents />} />
          <Route path="events/:eventId" element={<UpdateEvents />} />
          <Route path="promotion" element={<Promotions />} />
          <Route path="promotion/add-promo-code" element={<AddPromoCode />} />
          <Route
            path="edit-promotion/:promotionId"
            element={<EditPromotion />}
          />
          <Route path="reviews" element={<Reviews />} />
          <Route path="room_list" element={<RoomList />} />
          <Route path="add_new_room" element={<AddRoom />} />
          <Route path="update-room/:roomId" element={<UpdateRoom />} />
          <Route path="dashboardanalysis" element={<DashboardAnalysis />} />
          {/* setting nested routes */}
          <Route path="profile" element={<AdminSettingsPage />} />
          <Route path="page_management" element={<PageManagement />} />
          <Route
            path="employee_and_housekeeper_management"
            element={<EmployeeAndHousekeeperManagement />}
          />

          <Route path="basicinfo" element={<BasicInfo />} />
          <Route
            path="update-bookedRoom/:bookedId"
            element={<EditBookedRoomDetails />}
          />

          <Route
            path="editdashboardbooking/:bookingId"
            element={<EditDashBoardBooking />}
          />
        </Route>

        {/* employee dashboard nested routes */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
          <Route index element={<EmployeeOverview />} />
          <Route path="emp-overview" element={<EmployeeOverview />} />
          <Route path="emp-roomlist" element={<EmpRoomList />} />
          <Route path="emp-guestlist" element={<EmpGuestList />} />
          <Route path="emp-promotion" element={<EmpPromotionList />} />
          <Route path="emp-booking" element={<EmpDashboardBooking />} />
          <Route path="emp-room" element={<EmployeeAllRoom />} />
          <Route path="emp-available" element={<EmpAvailableRooms />} />
          <Route path="emp-booked" element={<EmpBookedRooms />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

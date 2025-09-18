// import React, { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import BookingForm from "../components/home/BookingForm";
// import UpcomingEvents from "../components/home/UpcomingEvents";
// import RoomSelection from "../components/home/RoomSelection";
// import TestimonialSection from "../components/home/Testimonial";
// import TopBar from "../components/home/Topbar";
// import HeaderImageCarousel from "../components/home/HeaderImageCarousel";
// import Footer from "../components/common/footer";
// import Aminities from "../components/home/Aminities";

// const Lodge: React.FC = () => {
//   const location = useLocation();

//   const topRef = useRef<HTMLDivElement>(null);
//   const roomRef = useRef<HTMLDivElement>(null);
//   const amenitiesRef = useRef<HTMLDivElement>(null);
//   const eventsRef = useRef<HTMLDivElement>(null);
//   const contactRef = useRef<HTMLDivElement>(null);

//   // Scroll to section based on hash
//   const scrollToSection = (section: string) => {
//     switch (section) {
//       case "home":
//         topRef.current?.scrollIntoView({ behavior: "smooth" });
//         break;
//       case "rooms":
//         roomRef.current?.scrollIntoView({ behavior: "smooth" });
//         break;
//       case "amenities":
//         amenitiesRef.current?.scrollIntoView({ behavior: "smooth" });
//         break;
//       case "events":
//         eventsRef.current?.scrollIntoView({ behavior: "smooth" });
//         break;
//       case "contact":
//         contactRef.current?.scrollIntoView({ behavior: "smooth" });
//         break;
//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     const hash = location.hash.replace("#", "");
//     if (hash) {
//       setTimeout(() => scrollToSection(hash), 100);
//     }
//   }, [location]);

//   return (
//     <main>
//       <div ref={topRef} id="home">
//         <TopBar />
//       </div>

//       <BookingForm />

//       <HeaderImageCarousel
//         onAmenitiesClick={() => scrollToSection("amenities")}
//         onContactClick={() => scrollToSection("contact")}
//         onBookClick={() => scrollToSection("rooms")}
//       />

//       <div ref={roomRef} id="rooms">
//         <RoomSelection />
//       </div>

//       <div ref={amenitiesRef} id="amenities">
//         <Aminities />
//       </div>

//       <div ref={eventsRef} id="events">
//         <UpcomingEvents />
//       </div>

//       <TestimonialSection />

//       <div ref={contactRef} id="contact">
//         <Footer />
//       </div>
//     </main>
//   );
// };

// export default Lodge;

export default function Lodge() {
  return (
    <div className='min-h-screen text-center mt-30 text-2xl'>
      Site is down due to payment issues. Please contact US for recovering your
      site.
    </div>
  )
}

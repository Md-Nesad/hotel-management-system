import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import testimonialOne from "../../assets/testimonialOne.jpg";
import testimonialTwo from "../../assets/testimonialTwo.jpg";
import user from "../../assets/userImage.png";
import { usePageData } from "../../context/PageDataContext";

const testimonials = [
  {
    id: 1,
    name: "Fabric Irine",
    image: testimonialOne,
    review:
      "Very nice place and welcoming they staff was nice my girlfriend asked for a particular food that wasn't on the menu and the staff did everything they could to make sure she gets one. thank you again for the care.",
  },
  {
    id: 2,
    name: "Ines. M",
    image: user,
    review:
      "Chambre agréable et propre, avec tout le nécessaire : serviettes, eau chaude et savon. Nous avons eu une femme de ménage tous les jours pour nettoyer notre chambre et changer les draps.",
  },
  {
    id: 3,
    name: "Patric Atibu",
    image: testimonialTwo,
    review:
      "Ahantu niheza cyane. kabisa muzaze mwirebere namwe. nahakunze muzazane nabakunzi banyume bafite inyama nziza na chef wabo ateka neza cyane. nziza na chef wabo ateka neza cyane.",
  },
];

const testimonialsPerPage = 3;

export default function TestimonialSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const { pageData } = usePageData();

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * testimonialsPerPage;
  const selectedTestimonials = testimonials.slice(
    startIndex,
    startIndex + testimonialsPerPage
  );

  return (
    <section className="w-full bg-white py-16 font-inter">
      <div className="max-w-[1080px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mt-2 text-[#191919]">
            {pageData?.reviewsTitle || "Our Clients Reviews"}
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevPage}
            className="absolute left-[-80px] top-1/2 transform -translate-y-1/2 bg-white border-2 shadow-md w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer focus:border-none focus:ring-2 focus:ring-blue-500 max-sm:hidden"
          >
            <ArrowLeft strokeWidth={3} />
          </button>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#f7f9fc] rounded-md shadow-[0_0_8px_rgba(0,0,0,0.25)] p-6 text-gray-700 relative flex flex-col justify-between min-h-[280px]"
              >
                <div>
                  <FaQuoteLeft className="text-[#ff7e00] text-2xl mb-7" />
                  <p className="text-sm leading-relaxed mb-2 italic">
                    {testimonial.review}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">
                      {testimonial.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextPage}
            className="absolute right-[-80px] top-1/2 transform -translate-y-1/2 bg-white border-2 shadow-md w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none max-sm:hidden"
          >
            <ArrowRight strokeWidth={3} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 cursor-pointer rounded-full transition-all duration-300 ${
                index === currentPage ? "bg-[#ff7e00]" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

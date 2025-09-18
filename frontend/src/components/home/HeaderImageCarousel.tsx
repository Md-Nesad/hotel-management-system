import { useEffect, useState } from "react";
import { usePageData } from "../../context/PageDataContext";

interface Slide {
  image: string;
  title: string;
  button: string;
}

interface HeaderImageCarouselProps {
  onContactClick: () => void;
  onAmenitiesClick: () => void;
  onBookClick: () => void;
}

export default function HeaderImageCarousel({
  onContactClick,
  onAmenitiesClick,
  onBookClick,
}: HeaderImageCarouselProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const { pageData, loading } = usePageData();

  // Load slides from API
  useEffect(() => {
    if (!pageData) return;
    const baseUrl = "https://backend.bahamaslrb.com/uploads/";
    const newSlides: Slide[] = [
      {
        image: baseUrl + pageData.img1,
        title: pageData.img1Title,
        button: pageData.button1,
      },
      {
        image: baseUrl + pageData.img2,
        title: pageData.img2Title,
        button: pageData.button2,
      },
      {
        image: baseUrl + pageData.img3,
        title: pageData.img3Title,
        button: pageData.button3,
      },
    ];
    setSlides(newSlides);
  }, [pageData]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  const handleButtonClick = () => {
    if (!pageData) return;
    const currentButton = slides[current].button.toLowerCase();

    if (currentButton === pageData?.button1.toLowerCase()) {
      onBookClick();
    } else if (currentButton === pageData?.button2.toLowerCase()) {
      onContactClick();
    } else if (currentButton === pageData?.button3.toLowerCase()) {
      onAmenitiesClick();
    }
  };

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="relative w-full max-w-[1055px] h-[380px] sm:h-[380px] xs:h-[200px] mx-auto overflow-hidden my-10 rounded-sm mt-56 max-sm:mt-10 px-2">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute rounded-md top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4 py-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
              {slide.title}
            </h2>

            <button
              className="bg-[#F9862D] hover:bg-orange-500 cursor-pointer text-white py-2 px-5 rounded transition-all duration-300 text-sm sm:text-base"
              onClick={handleButtonClick}
            >
              {slide.button}
            </button>
          </div>

          <div className="absolute bottom-5 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goToSlide(dotIndex)}
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                  current === dotIndex
                    ? "bg-orange-500 border-orange-500 scale-110"
                    : "bg-white/70 border-white/40"
                }`}
                aria-label={`Go to slide ${dotIndex + 1}`}
              ></button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  baseUrl: string;
}

const RoomImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  baseUrl,
}) => {
  const [currentIdx, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setLoading(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setLoading(true);
  };

  const currentImage = `${baseUrl}${images[currentIdx]}`;

  return (
    <div className="relative group w-full h-48 sm:h-36 md:h-36 lg:h-80 xl:h-60 overflow-hidden rounded bg-gray-100">
      {/* Image */}
      <img
        src={currentImage}
        alt={`room-${currentIdx}`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
      />

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-10 z-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-700" />
        </div>
      )}

      {/* Navigation Arrows with low opacity + animation */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-gray-300 hover:text-white transition-all duration-700 p-1 rounded-full cursor-pointer z-20 opacity-0 group-hover:opacity-100 group-hover:-translate"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 text-gray-300 hover:text-white transition-all duration-700 p-1 rounded-full cursor-pointer z-20 opacity-0 group-hover:opacity-100 group-hover:translate hover:bg-opacity-75"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default RoomImageCarousel;

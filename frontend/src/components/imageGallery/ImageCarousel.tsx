import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

const ImageCarouselRoom: React.FC<ImageCarouselProps> = ({
  images = [],
  alt = "",
  className = "",
}) => {
  const [current, setCurrent] = useState(0);

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
        <ImageOff className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-xl mx-auto ${className}`}>
      <img
        src={images[current]}
        alt={alt}
        className="w-full h-64 object-cover rounded-lg transition duration-500"
      />
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default ImageCarouselRoom;

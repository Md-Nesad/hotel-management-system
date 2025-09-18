import React, { useEffect, useState } from "react";

export interface CarouselImage {
  id: number | string;
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length, isTransitioning]);

  useEffect(() => {
    if (isTransitioning) {
      const transitionEndTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(transitionEndTimer);
    }
  }, [isTransitioning]);

  const getNextIndex = (index: number) => {
    return index === images.length - 1 ? 0 : index + 1;
  };

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="relative w-full">
          <div className="relative w-full h-[500px] overflow-hidden">
            {images.map((image, index) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                className={`
                  absolute top-0 left-0 w-full h-full object-cover
                  transition-transform duration-1000 ease-in-out
                  ${index === currentIndex ? 'translate-x-0' :
                    index === getNextIndex(currentIndex) ? 'translate-x-full' :
                    'translate-x-full'
                  }
                  ${isTransitioning && index === currentIndex ? '-translate-x-full' : ''}
                  ${isTransitioning && index === getNextIndex(currentIndex) ? 'translate-x-0' : ''}
                `}
              />
            ))}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-20">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;

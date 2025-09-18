import React from 'react';
import ImageCarousel from '../ui/ImageCarousel';
import type { CarouselImage } from '../ui/ImageCarousel';

const HotelImagesPage: React.FC = () => {
  const hotelImages: CarouselImage[] = [
    {
      id: 'hotel-1',
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      alt: "Luxury Hotel Front Entrance"
    },
    {
      id: 'hotel-2',
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      alt: "Grand Hotel Exterior View"
    },
    {
      id: 'hotel-3',
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      alt: "Peaceful Hotel Garden View"
    },
    {
      id: 'hotel-4',
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      alt: "Relaxing Hotel Pool Area"
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4 py-16 sm:px-8 md:px-16">
      <div className="w-full max-w-6xl text-center">
        <h2 className="text-white text-3xl font-bold font-nunito mb-8">
          Explore Our Hotel Gallery
        </h2>
        <ImageCarousel images={hotelImages} />
      </div>
    </div>
  );
};

export default HotelImagesPage;

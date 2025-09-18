const BookingFormSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white font-inter sm:fixed sm:top-26 left-0 z-40 animate-pulse">
      <div className="bg-white border mx-auto border-gray-200 shadow-md p-4 flex flex-row flex-wrap sm:items-center gap-4 justify-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-16 w-36"></div>
        ))}
        <div className="bg-gray-200 rounded-lg h-10 w-36 mt-2"></div>
      </div>
    </div>
  );
};

export default BookingFormSkeleton;

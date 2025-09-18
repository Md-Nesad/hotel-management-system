// components/TouristDirectionMap.tsx
import { useEffect, useState } from "react";

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  type: string;
}

interface DirectionResponse {
  distance: string;
  duration: string;
}

const TouristDirectionMap = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [directionData, setDirectionData] = useState<DirectionResponse | null>(
    null
  );

  // Fetch tourist spot location from GET API
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("http://185.170.58.79:5000/api/map");
        const data = await res.json();
        setLocationData(data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocation();
  }, []);

  // Handle direction request: Send user location as latitude & longitude
  const handleGetDirection = () => {
    if (!locationData) {
      alert("Location data not loaded yet!");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const payload = {
            name: locationData.name || "Unknown",
            latitude: userLat,
            longitude: userLng,
            description: locationData.description || "Unknown",
            type: locationData.type || "Unknown",
          };

          console.log("Sending Payload:", payload); // Debugging

          try {
            const res = await fetch("http://185.170.58.79:5000/api/locations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            const data = await res.json();
            setDirectionData(data);
          } catch (error) {
            console.error("Error sending user location:", error);
          }
        },
        () => {
          alert("Location permission denied!");
        }
      );
    } else {
      alert("Geolocation not supported!");
    }
  };

  return (
    <div className="">
      <button
        onClick={handleGetDirection}
        className="bg-blue-600 cursor-pointer text-white px-5 py-2 absolute rounded shadow hover:bg-blue-700 transition"
      >
        Get Direction and details
      </button>
      {/* Show tourist spot map */}
      {locationData && (
        <iframe
          src={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}&z=15&output=embed`}
          width="100%"
          height="200"
          allowFullScreen
          loading="lazy"
          className="rounded-md border"
        ></iframe>
      )}

      {/* Direction Button */}

      {/* Show Backend Response */}
      {directionData && (
        <div className="p-4 bg-gray-100 rounded-md space-y-2 shadow">
          <p>
            <strong>Distance:</strong>{" "}
            {directionData.distance || "calculating...."}
          </p>
          <p>
            <strong>Estimated Time:</strong>{" "}
            {directionData.duration || "2 hours"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TouristDirectionMap;

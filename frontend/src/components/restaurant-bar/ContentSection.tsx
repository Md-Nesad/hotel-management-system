import { useEffect, useState } from "react";
import axios from "axios";

const ContentSection = () => {
  const [contentItems, setContentItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://185.170.58.79:5000/blog", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Map API response to match the expected structure
        const mappedItems = response.data.map((item: any) => ({
          id: item._id || item.id, // Adjust based on API response field
          title: item.title,
          content: item.description,
          image: item.image || 'https://via.placeholder.com/800x400', // Fallback if no image
          alt: `${item.title} image`,
          layout: item.id % 2 === 0 ? 'right' : 'left', // Alternate layout
        }))
        setContentItems(mappedItems)
        setError(null)
      } catch (err) {
        setError('Failed to fetch content. Please try again later.')
        console.error('Content fetch error:', err)
        // Fallback to hardcoded data if API fails
        setContentItems([
          {
            id: 1,
            title: "Experience Luxury Dining",
            content:
              "Indulge in our world-class restaurant where culinary artistry meets sophisticated ambiance...",
            image:
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
            alt: "Luxury restaurant interior",
            layout: "left",
          },
          {
            id: 2,
            title: "Unwind at Our Premium Bar",
            content:
              "Step into our sophisticated bar where premium spirits meet creative mixology...",
            image:
              "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
            alt: "Premium bar interior",
            layout: "right",
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading)
    return <p className="text-center text-gray-600 py-20">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-20">{error}</p>;

  return (
    <section
      className="w-full bg-white text-black py-20 px-4"
      aria-label="Explore dining and bar experiences"
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-20">
          {contentItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col ${
                item.layout === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-10 lg:gap-16 items-center`}
            >
              {/* Text Section */}
              <div className='lg:w-1/2 space-y-4'>
                <h3
                  className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight'
                  aria-label={item.title}
                >
                  {item.title}
                </h3>
                <p
                  className='text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed'
                  aria-label={`Description for ${item.title}`}
                >
                  {item.content}
                </p>
              </div>

              {/* Image Section */}
              <div className='lg:w-1/2 w-full'>
                <img
                  src={item.image}
                  alt={item.alt}
                  className='w-full h-64 sm:h-72 md:h-96 object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105'
                  loading='lazy'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContentSection;

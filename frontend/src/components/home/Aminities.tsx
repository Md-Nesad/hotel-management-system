import {
  Wifi,
  Car,
  UtensilsCrossed,
  Ban,
  Users,
  ShowerHead,
  Tv,
  ConciergeBell,
  Droplet,
} from 'lucide-react'
import { usePageData } from '../../context/PageDataContext'

const amenities = [
  {
    icon: Wifi,
    text: 'Free Wi-Fi',
    description: 'Free connected with high-speed internet access.',
  },
  {
    icon: Car,
    text: 'Free Parking',
    description: 'Convenient and secure on-site parking at no extra cost',
  },
  {
    icon: UtensilsCrossed,
    text: 'Food Available at Bar',
    description: 'Enjoy delicious food from our bar menu.',
  },
  {
    icon: Tv,
    text: 'In-room TV',
    description: 'Relax with a TV in your room for entertainment.',
  },
  {
    icon: ShowerHead,
    text: 'Private Bathroom',
    description: 'Your room includes a private bathroom for comfort.',
  },
  {
    icon: Droplet,
    text: 'Water Heater',
    description:
      'Enjoy hot water anytime with our in-room water heating system.',
  },
  {
    icon: Users,
    text: 'Separate Room',
    description: 'Enjoy your own private space with a separate',
  },
  {
    icon: ConciergeBell,
    text: 'Towel Service',
    description: 'Fresh towels provided daily for your convenience.',
  },
  {
    icon: Ban,
    text: 'No Smoking',
    description: 'For your comfort and safety smoking is strictly',
  },
]
export default function Aminities() {
  const { pageData } = usePageData()

  return (
    <>
      <div className='py-12 sm:py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-12'>
          <div className='text-center mb-8 sm:mb-12 md:mb-16 fade-in'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-nunito font-extrabold text-[#000000] tracking-wide'>
              {pageData?.amenitiesTitle || 'Our Amenities'}
            </h2>
            <p className='mt-2 sm:mt-4 text-gray-600 font-inter text-base sm:text-lg'>
              {pageData?.amenitiesSubTitle ||
                'Discover the comforts that await you'}
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12'>
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl shadow-xl p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-300 group cursor-pointer border border-gray-100 hover:border-orange-400 backdrop-blur-sm bg-opacity-80 fade-in'
              >
                <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform group-hover:-translate-y-2 transition-transform duration-300 shadow-lg'>
                  <amenity.icon className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
                </div>
                <h3 className='font-nunito font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300'>
                  {amenity.text}
                </h3>
                <p className='font-inter text-gray-600 text-xs sm:text-sm leading-relaxed'>
                  {amenity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

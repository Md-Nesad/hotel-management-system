import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'

const BlogSection = () => {
  return (
    <section className='py-14 bg-gray-900 font-inter'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Top Section */}
        <div className='p-4 sm:p-6 mb-12'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
            {/* Welcome Text */}
            <div className='lg:col-span-2 max-w-[700px] w-full'>
              <h1 className='text-2xl sm:text-3xl font-nunito font-bold text-white mb-3 sm:mb-4 leading-snug'>
                Welcome to Westlake
              </h1>
              <p className='text-white text-sm sm:text-base leading-relaxed'>
                Off I-90, 12 miles from Cleveland Hopkins International Airport
                (CLE®), Wyndham Garden Westlake ensures a seamless stay with
                free WiFi and parking, a restaurant, bar, gym, pool, and
                expansive meeting and event space. Our non-smoking hotel is just
                one mile from shopping and dining at Crocker Park, and
                University Hospitals and the Cleveland Clinic Main Campus are
                also close by. While here, head to downtown Cleveland for the
                Rock & Roll Hall of Fame, Guardians games at Progressive Field,
                and Cavaliers games at Rocket Mortgage Fieldhouse.
              </p>
            </div>

            {/* Rating Card */}
            <Card className='lg:col-span-1 w-full max-w-xl sm:max-w-2xl ml-auto bg-gray-100'>
              <CardHeader className='pb-3'>
                <div className='text-center sm:text-right'>
                  <div className='flex flex-col items-center sm:items-end mb-3'>
                    <div className='flex items-center'>
                      <span className='text-lg sm:text-xl font-bold text-gray-900 mr-2'>
                        2.9
                      </span>
                      <div className='flex'>
                        {[1, 2].map((star) => (
                          <Star
                            key={star}
                            className='w-4 h-4 fill-yellow-400 text-yellow-400'
                          />
                        ))}
                        <Star className='w-4 h-4 fill-gray-300 text-gray-900' />
                        {[4, 5].map((star) => (
                          <Star key={star} className='w-4 h-4 text-gray-900' />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className='text-gray-900 text-xs sm:text-sm text-center sm:text-right mt-1'>
                    (249 reviews)
                  </p>
                </div>
              </CardHeader>

              <CardContent className='pt-0 pb-4'>
                <div className='grid grid-cols-2 gap-6 text-center'>
                  <div>
                    <p className='text-xs text-gray-900 uppercase tracking-wider mb-1'>
                      Check In
                    </p>
                    <p className='text-base font-semibold text-gray-900'>
                      3:00 PM
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-900 uppercase tracking-wider mb-1'>
                      Check Out
                    </p>
                    <p className='text-base font-semibold text-gray-900'>
                      11:00 AM
                    </p>
                  </div>
                </div>
              </CardContent>

              <div className='text-center sm:text-right pb-5 px-6'>
                <button className='text-green-600 font-medium hover:underline text-sm sm:text-base'>
                  Hotel Policies
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section with Image and Description */}
        <div className='overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6'>
            <div className='w-full flex items-center justify-center'>
              <img
                src='https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
                alt='Hotel amenities'
                className='w-full max-w-[500px] h-[220px] sm:h-[280px] lg:h-[320px] object-cover rounded-lg shadow-md'
              />
            </div>
            <div className='p-4 sm:p-6 flex flex-col justify-center'>
              <h2 className='text-xl sm:text-2xl font-nunito font-bold text-white mb-2 sm:mb-3 leading-tight'>
                Redefining Expectations
              </h2>
              <h3 className='text-base sm:text-lg font-nunito font-semibold text-white mb-2'>
                You'll love free WiFi, a gym, pool, restaurant, and bar
              </h3>
              <p className='text-white text-sm sm:text-base leading-relaxed'>
                Grab breakfast or dinner at our restaurant and relax with a bar,
                heated indoor pool, and hot tub. Stay active in the fitness
                center and take care of work with free WiFi, a business center,
                and ample meeting space. Each non-smoking guest room features a
                mini-refrigerator, microwave, coffee/tea maker, flat-screen TV
                with HBO®, laptop-sized safe, desk, ironing amenities, hair
                dryer, and bath products. We also offer free parking, on-site
                car rental, laundry facilities, dry cleaning service, a
                convenience store, and 24/7 front desk staff. Dogs are welcome
                for an extra fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection

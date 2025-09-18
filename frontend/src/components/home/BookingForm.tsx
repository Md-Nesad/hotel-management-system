import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Tag } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import './BookingForm.css'
import CheckStayButton from './StayWithButton'
import BookingFormSkeleton from '../booking/BookingFormLoading'
import { jwtDecode } from 'jwt-decode'

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token)
    if (!decoded.exp) return true
    const now = Date.now() / 1000 // in seconds
    return decoded.exp < now
  } catch {
    return true
  }
}

const BookingForm = () => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)
  const [promoCode, setPromoCode] = useState('')
  const [calendarVisibleCheckIn, setCalendarVisibleCheckIn] = useState(false)
  const [calendarVisibleCheckOut, setCalendarVisibleCheckOut] = useState(false)
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchPromotions = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('https://backend.bahamaslrb.com/promotion/all', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch promotions')
      }

      const data = await res.json()
      setPromotions(data)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates')
      return
    }

    const token = localStorage.getItem('token')

    // If user entered a promo code, validate login and promo
    let matchedPromo = null
    if (promoCode.trim()) {
      if (!token) {
        alert('You must be logged in to use a promo code.')
        return
      }

      if (isTokenExpired(token)) {
        alert('Session expired. Please login again.')
        localStorage.removeItem('token')
        return
      }

      // Check if promo code exists
      matchedPromo = promotions.find(
        (promo) =>
          promo.promoCode?.toLowerCase() === promoCode.trim().toLowerCase()
      )

      if (!matchedPromo) {
        alert('Invalid promo code.')
        return // stop navigation
      }
    }

    // Proceed with search
    const params = new URLSearchParams({
      checkin: format(checkInDate, 'yyyy-MM-dd'),
      checkout: format(checkOutDate, 'yyyy-MM-dd'),
      promo: promoCode,
    })

    navigate(`/avaliable-rooms?${params.toString()}`, {
      state: {
        promo: matchedPromo,
      },
    })
  }

  if (loading) return <BookingFormSkeleton />

  return (
    <div className='w-full bg-white font-inter sm:fixed sm:top-26 left-0 z-40'>
      <div className='bg-white border mx-auto border-gray-200 shadow-md p-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4'>
        <div className='bg-white mx-auto flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4'>
          {/* Check-in Date */}
          <fieldset className='relative border border-gray-400 rounded-lg px-2 w-full sm:w-auto'>
            <legend className='text-sm font-medium text-gray-600'>
              Check-in Date
            </legend>
            <div className='relative'>
              <input
                id='checkin'
                type='text'
                value={checkInDate ? format(checkInDate, 'yyyy-MM-dd') : ''}
                onFocus={() => setCalendarVisibleCheckIn(true)}
                placeholder='Select a Date'
                className='w-full sm:w-36 px-1 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] mb-2'
                readOnly
              />
              <CalendarIcon
                className={`absolute right-1 top-3 -translate-y-1/2 cursor-pointer ${
                  calendarVisibleCheckIn
                    ? 'text-[var(--color-orange)]'
                    : 'text-gray-400'
                }`}
                onClick={() =>
                  setCalendarVisibleCheckIn(!calendarVisibleCheckIn)
                }
              />
              {calendarVisibleCheckIn && (
                <div className='absolute top-full left-0 z-30 mt-2 p-2 bg-white rounded-lg shadow-md border'>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => {
                      if (date) setCheckInDate(date)
                      setCalendarVisibleCheckIn(false)
                    }}
                    dateFormat='yyyy-MM-dd'
                    minDate={new Date()}
                    inline
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* Check-out Date */}
          <fieldset className='relative border border-gray-300 rounded-lg px-2 w-full sm:w-auto'>
            <legend className='text-sm font-medium text-gray-600'>
              Check-out Date
            </legend>
            <div className='relative'>
              <input
                id='checkout'
                type='text'
                value={checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : ''}
                onFocus={() => setCalendarVisibleCheckOut(true)}
                placeholder='Select a Date'
                className='w-full sm:w-36 px-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] mb-2'
                readOnly
              />
              <CalendarIcon
                className={`absolute right-1 top-3 -translate-y-1/2 cursor-pointer ${
                  calendarVisibleCheckOut
                    ? 'text-[var(--color-orange)]'
                    : 'text-gray-400'
                }`}
                onClick={() =>
                  setCalendarVisibleCheckOut(!calendarVisibleCheckOut)
                }
              />
              {calendarVisibleCheckOut && (
                <div className='absolute top-full left-0 z-30 mt-2 p-2 bg-white rounded-lg shadow-md border'>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => {
                      if (date) setCheckOutDate(date)
                      setCalendarVisibleCheckOut(false)
                    }}
                    dateFormat='yyyy-MM-dd'
                    minDate={checkInDate || new Date()}
                    inline
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* Promo Code */}
          <fieldset className='relative border border-gray-300 rounded-lg px-2 w-full sm:w-auto'>
            <legend className='text-sm font-medium text-gray-600'>
              Promo Code
            </legend>
            <div className='relative'>
              <input
                id='promo'
                type='text'
                placeholder='Enter code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className='w-full sm:w-36 pl-9 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] mb-2'
              />
              <Tag className='absolute left-1 top-1/2 -translate-y-1/2 text-gray-400' />
            </div>
          </fieldset>

          {/* Book Button */}
          <button
            onClick={handleSearch}
            className='bg-[#D3D3D3] hover:bg-[#F9862D] hover:text-[#FFFFFF] px-10 py-2 rounded-md border hover:border-orange-500 border-gray-300 shadow-sm font-medium text-[#000000d8] transition cursor-pointer w-full sm:w-auto mt-2 sm:mr-52'
          >
            Book
          </button>

          {/* Optional: Extra Button */}
          <CheckStayButton />
        </div>
      </div>
    </div>
  )
}

export default BookingForm

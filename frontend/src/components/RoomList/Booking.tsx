import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import axios from 'axios'
import HouseKeeper from '../icons/HouseKeeper'
import BookingNav from './BookingNav'

interface Book {
  _id: string
  bed_size: string
  beds: string
  baths: string
  description: string
  name: string
  price: number
  amenities: string[]
  status: 'Available' | 'Booked' | 'pending'
  checkIn: string
  checkOut: string
  housekeepingStatus: string
  bookingStatus: string
}

interface HouseKeeper {
  _id: string
  status: string
  room: {
    _id: string
  }
}

const Booking: React.FC = () => {
  const [booking, setBooking] = useState<Book[]>([])
  const [openFormRoomId, setOpenFormRoomId] = useState<string | null>(null)
  const [houseKeeper, setHouseKeeper] = useState<HouseKeeper[]>([])
  const [formData, setFormData] = useState({ houseKeeperName: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'https://backend.bahamaslrb.com/api/rooms',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setBooking(response.data)
      } catch (err) {
        setError('Failed to fetch rooms. Please try again later please. ' + err)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  //fetch houseKeeping
  const fetchHousekeeping = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        'https://backend.bahamaslrb.com/housekeeping'
      )
      setHouseKeeper(response.data)
    } catch (error) {
      console.error('Failed to fetch housekeeping data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchHousekeeping()
  }, [])

  //avaliable rooms
  const avaliableRooms = booking.filter((book) => book.status === 'Available')
  //handle delete
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this room?'
    )
    if (!confirmed) return // User canceled
    try {
      await axios.delete(`https://backend.bahamaslrb.com/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      alert('Room deleted successfully!')
      setBooking(booking.filter((book) => book._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className='p-6 text-center'>Loading...</div>
  if (error)
    return <div className='p-6 text-center text-orange-500'>{error}</div>
  return (
    <>
      {/* booking nav */}
      {location.pathname === '/dashboard/dashboard_booking' && <BookingNav />}

      {/* booking content */}
      <div className='text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg'>
        <div className='overflow-y-visible'>
          <table className='min-w-full border border-gray-300 text-xs bg-white rounded-xl'>
            <thead className='text-[15px] text-[#00000080]'>
              <tr>
                {[
                  'AV Rooms',
                  'House Keeping',
                  'Room No/ Bed Size',
                  'Room Name',
                  'Beds/ Bath',
                  'Description',
                  'Check-In/Check-out time',
                  'Duration',
                  'Price / Discount',
                  'Amenities',
                  'Actions',
                ].map((col) => (
                  <th
                    key={col}
                    className='border border-gray-200 px-2 py-1 text-left'
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='text-[13px]'>
              {avaliableRooms.length > 0 ? (
                avaliableRooms.map((book) => (
                  <tr
                    key={book._id}
                    className='border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]'
                  >
                    <td className='border border-gray-200 px-1 w-[240px] text-[#FFFFFF]'>
                      <Link to='/dashboard/add_booking'>
                        <span className=' rounded-md text-16 bg-[#F9862D] p-1 cursor-pointer'>
                          Book Now
                        </span>
                      </Link>
                    </td>
                    <td
                      className={`border border-gray-200 pl-2 py-2 w-[106px] font-bold ${(() => {
                        const status =
                          houseKeeper.find((hk) => hk?.room?._id === book?._id)
                            ?.status || book?.housekeepingStatus

                        if (!status) return 'text-gray-500' // jodi kono status na thake

                        if (status.toLowerCase() === 'clean')
                          return 'text-[#196199]'
                        if (status.toLowerCase() === 'dirty')
                          return 'text-[#F9862D]'

                        return 'text-gray-500' // default color jodi clean o dirty na hoy
                      })()}`}
                    >
                      {houseKeeper.find((hk) => hk?.room?._id === book?._id)
                        ?.status ||
                        book?.housekeepingStatus?.slice(0, 1)?.toUpperCase() +
                          book?.housekeepingStatus?.slice(1)}
                    </td>

                    <td className='border border-gray-200 w-[400px] px-2 py-2'>
                      {book?.bed_size || 'Queen Bed'}
                    </td>
                    <td className='border border-gray-200 pl-2 py-2 w-[570px]'>
                      {book?.name || '-'}
                    </td>
                    <td className='border border-gray-200 px-3 py-2 w-[353px]'>
                      {book?.baths && book?.beds !== null ? (
                        <>
                          {book?.beds} Beds
                          <br />
                          {book?.baths} Baths
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td
                      title={book?.description}
                      className='border border-gray-200 px-2 py-2 w-[300px]'
                    >
                      {book?.description?.slice(0, 26) || 'N/A'}...
                    </td>
                    <td className='border text-center border-gray-200 py-2 w-[603px]'>
                      --
                    </td>
                    <td className='border text-center border-gray-200 py-2 text-[14px]'>
                      --
                    </td>
                    <td className='border border-gray-200 px-1 py-2 mr-3'>
                      <span className='text-gray-500'>
                        {book?.price?.toLocaleString('en-US')}Frw
                      </span>
                    </td>
                    <td
                      title={book?.amenities.join(', ')}
                      className='border border-gray-200 px-3 py-2 w-[300px]'
                    >
                      {book?.amenities?.join(', ')?.slice(0, 20) || '-'}
                      ...
                    </td>
                    <td className='border border-gray-200 px-2 py-1 w-[120px]'>
                      <div className='flex gap-1'>
                        <div className='relative'>
                          <button
                            title='notes'
                            onClick={() =>
                              book?._id &&
                              setOpenFormRoomId(
                                openFormRoomId === book?._id ? null : book?._id
                              )
                            }
                            className={`text-black p-1 rounded-xs cursor-pointer ${
                              book?._id
                                ? 'bg-gray-300'
                                : 'bg-gray-200 cursor-not-allowed'
                            }`}
                            disabled={!book?._id}
                          >
                            <HouseKeeper />
                          </button>

                          {book?._id && openFormRoomId === book?._id && (
                            <div className='absolute z-20 top-8 right-0 bg-white border border-gray-300 shadow-lg p-2 rounded-md w-48'>
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault()
                                  if (!formData.notes) {
                                    alert('Please enter a notes')
                                    setSubmitting(false)
                                    return
                                  }

                                  try {
                                    const token = localStorage.getItem('token')
                                    await axios.post(
                                      'https://backend.bahamaslrb.com/housekeeping',
                                      {
                                        houseKeeperName: 'Nesad',
                                        notes: formData.notes,
                                        room: book?._id,
                                        status: book?.housekeepingStatus,
                                      },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    )
                                    alert('Submitted successfully!')
                                    setFormData({
                                      houseKeeperName: '',
                                      notes: '',
                                    })
                                    setOpenFormRoomId(null)
                                  } catch (err) {
                                    alert('Failed to submit' + err)
                                  } finally {
                                    setSubmitting(false)
                                  }
                                }}
                                className='space-y-1 text-[12px]'
                              >
                                {/* <input
                                    type="text"
                                    placeholder="House Keeper Name"
                                    value={formData.houseKeeperName}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        houseKeeperName: e.target.value,
                                      })
                                    }
                                    className="border p-1 w-full rounded"
                                  /> */}
                                <textarea
                                  placeholder='Notes'
                                  value={formData.notes}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      notes: e.target.value,
                                    })
                                  }
                                  className='border p-1 w-full rounded'
                                />
                                <button
                                  type='submit'
                                  onClick={() => setSubmitting(true)}
                                  className={`text-white text-xs px-2 py-1 rounded w-full cursor-pointer transition-colors duration-150
                                       bg-blue-500 hover:bg-[#F9862D]`}
                                >
                                  {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                              </form>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(book._id)}
                          title='delete'
                          className='text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs cursor-pointer'
                        >
                          <X size={19} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className='text-center py-4 text-gray-500'>
                    No room for booking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Booking

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import axios from 'axios'
import HouseKeeper from '../icons/HouseKeeper'

interface Book {
  checkIn: string
  checkOut: string
}

interface HouseKeeper {
  _id: string
  status: string
  room: {
    _id: string
  }
}

interface Room {
  _id: string
  id: number
  name: string
  beds: string
  baths: string
  bed_size: string
  housekeepingStatus: string
  description: string
  roomType: string
  price: number
  amenities: string[]
  status: 'Available' | 'Booked' | 'Unavailable'
  booking: Book
}

const Booking: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [openFormRoomId, setOpenFormRoomId] = useState<string | null>(null)
  const [houseKeeper, setHouseKeeper] = useState<HouseKeeper[]>([])
  console.log('houseKeeper', houseKeeper)
  const [formData, setFormData] = useState({ houseKeeperName: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'https://backend.bahamaslrb.com/api/rooms-with-bookings',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setRooms(response.data)
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
      setRooms(rooms.filter((room) => room._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className='p-6 text-center'>Loading...</div>
  if (error)
    return <div className='p-6 text-center text-orange-500'>{error}</div>
  return (
    <>
      {/* booking content */}
      <div className='text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-lg'>
        <div className='overflow-y-visible'>
          <table className='min-w-full border border-gray-300 text-xs bg-white rounded-xl'>
            <thead className='text-[15px] text-[#00000080]'>
              <tr>
                {[
                  'Status',
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
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr
                    key={room._id}
                    className='border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]'
                  >
                    <td className='border border-gray-200 px-1 py-3 w-[300px]'>
                      {room?.status === 'Unavailable' ? (
                        <span className='rounded-md text-10 p-1 bg-[#A3A3A3] text-white'>
                          Booked
                        </span>
                      ) : (
                        <Link to='/dashboard/add_booking'>
                          <span className='rounded-md text-10 p-1 bg-[#F9862D] text-white'>
                            Book Now
                          </span>
                        </Link>
                      )}
                    </td>
                    <td
                      className={`border border-gray-200 pl-2 py-2 w-[106px] font-bold ${(() => {
                        const status =
                          houseKeeper.find((hk) => hk?.room?._id === room?._id)
                            ?.status || room?.housekeepingStatus

                        if (!status) return 'text-gray-500' // jodi kono status na thake

                        if (status.toLowerCase() === 'clean')
                          return 'text-[#196199]'
                        if (status.toLowerCase() === 'dirty')
                          return 'text-[#F9862D]'

                        return 'text-gray-500' // default color jodi clean o dirty na hoy
                      })()}`}
                    >
                      {houseKeeper.find((hk) => hk?.room?._id === room?._id)
                        ?.status ||
                        room?.housekeepingStatus?.slice(0, 1)?.toUpperCase() +
                          room?.housekeepingStatus?.slice(1)}
                    </td>

                    <td className='border border-gray-200 w-[400px] px-2 py-2'>
                      {room?.bed_size || 'Queen Bed'}
                    </td>
                    <td className='border border-gray-200 pl-2 py-2 w-[570px]'>
                      {room?.name || '-'}
                    </td>
                    <td className='border border-gray-200 px-3 py-2 w-[233px]'>
                      {room?.baths && room?.beds !== null ? (
                        <>
                          {room?.beds} Beds
                          <br />
                          {room?.baths} Baths
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td
                      title={room?.description}
                      className='border border-gray-200 px-2 py-2 w-[400px]'
                    >
                      {room?.description?.slice(0, 26) || 'N/A'}...
                    </td>
                    <td className='border border-gray-200 pl-3 py-3 w-[703px] 2xl:text-center'>
                      {room?.status === 'Unavailable' ? (
                        <>
                          {room?.booking?.checkIn && room?.booking?.checkOut ? (
                            <>
                              {new Date(
                                room.booking.checkIn
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                              : 4 pm
                              <br />
                              {new Date(
                                room.booking.checkOut
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                              : 11 am
                            </>
                          ) : (
                            <>
                              Jul 10, 2025 : 4 pm <br />
                              Jul 12, 2025 : 11 am
                            </>
                          )}
                        </>
                      ) : (
                        <div className='2xl:text-center'>
                          <span>--</span>
                        </div>
                      )}
                    </td>
                    <td className='border border-gray-200 py-3 text-center mr-3'>
                      {room?.status === 'Unavailable'
                        ? room?.booking?.checkIn
                          ? Math.ceil(
                              (new Date(room?.booking?.checkOut).getTime() -
                                new Date(room?.booking?.checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) +
                            '' +
                            ' Days'
                          : '2 Days'
                        : '--'}
                    </td>
                    <td className='border border-gray-200 px-1 py-2 mr-3'>
                      <span className='text-gray-500'>
                        {room?.price?.toLocaleString('en-US')} Frw
                      </span>
                    </td>
                    <td
                      title={room?.amenities.join(', ')}
                      className='border border-gray-200 px-3 py-2 w-[300px]'
                    >
                      {room?.amenities?.join(', ')?.slice(0, 20) || '-'}
                      ...
                    </td>
                    <td className='border border-gray-200 px-2 py-1 w-[120px]'>
                      <div className='flex gap-1'>
                        <div className='relative'>
                          <button
                            title='notes'
                            onClick={() =>
                              room?._id &&
                              setOpenFormRoomId(
                                openFormRoomId === room?._id ? null : room?._id
                              )
                            }
                            className={`text-black p-1 rounded-xs cursor-pointer ${
                              room?._id
                                ? 'bg-gray-300'
                                : 'bg-gray-200 cursor-not-allowed'
                            }`}
                            disabled={!room?._id}
                          >
                            <HouseKeeper />
                          </button>

                          {room?._id && openFormRoomId === room?._id && (
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
                                        room: room?._id,
                                        status: room?.housekeepingStatus,
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
                          onClick={() => handleDelete(room._id)}
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
                    No rooms found.
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

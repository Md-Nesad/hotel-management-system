import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import HouseKeeper from '../icons/HouseKeeper'

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

const UnAvailableRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openFormRoomId, setOpenFormRoomId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ houseKeeperName: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

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
        setError(null)
      } catch (err) {
        setError('Failed to fetch available rooms. Please try again later.')
        console.error('Error fetching rooms:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  // filtered avaliable rooms
  const unAvailableRooms = rooms.filter((room) => room.status === 'Unavailable')

  const handleDeleteRoom = async (roomId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this room?'
    )
    if (!confirmed) return // User canceled
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`https://backend.bahamaslrb.com/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId))
      alert('Room deleted successfully!')
    } catch (err) {
      console.error('Error deleting room:', err)
    }
  }
  if (loading) return <div className='p-6 text-center'>Loading...</div>
  if (error)
    return <div className='p-6 text-center text-orange-500'>{error}</div>

  return (
    <div className='text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl'>
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
            {unAvailableRooms.length > 0 ? (
              unAvailableRooms.map((room) => (
                <tr
                  key={room._id}
                  className='border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]'
                >
                  <td className='border border-gray-200 px-1 py-3 w-[60px]'>
                    <span className=' rounded-md bg-[#A3A3A3] px-2 py-1 text-16 text-[#FFFFFF] '>
                      Booked
                    </span>
                  </td>
                  <td className='border border-gray-200 font-bold pl-3 py-2 w-[106px] text-[#196199]'>
                    Clean
                  </td>

                  <td className='border border-gray-200 w-[400px] px-2 py-3'>
                    {room.bed_size || 'Queen Bed'}
                  </td>
                  <td className='border border-gray-200 pl-2 py-3 w-[630px]'>
                    {room.name || 'N/A'}
                  </td>
                  <td className='border border-gray-200 px-3 py-3 w-[193px]'>
                    {room.baths && room.beds !== null ? (
                      <>
                        {room.beds} Beds
                        <br />
                        {room.baths} Baths
                      </>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td
                    title={room.description}
                    className='border border-gray-200 px-2 py-3 w-[523px]'
                  >
                    {room.description?.slice(1, 27) ||
                      'Second bath in living room'}
                    ...
                  </td>
                  <td className='border border-gray-200  pl-3 py-3 w-[703px]'>
                    {room?.status === 'Unavailable' ? (
                      <>
                        {room?.booking?.checkIn && room?.booking?.checkOut ? (
                          <>
                            {new Date(room.booking.checkIn).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                            : 4 pm
                            <br />
                            {new Date(room.booking.checkOut).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
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
                    {room?.booking?.checkIn
                      ? Math.ceil(
                          (new Date(room?.booking?.checkOut).getTime() -
                            new Date(room?.booking?.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) +
                        '' +
                        ' Days'
                      : '2 Days'}{' '}
                  </td>
                  <td className='border border-gray-200 px-1 py-2 mr-3'>
                    <span className='text-gray-500'>
                      {room?.price?.toLocaleString('en-US')}Frw
                    </span>
                  </td>
                  <td
                    title={room.amenities.join(', ')}
                    className='border border-gray-200 px-3 py-3 w-[200px]'
                  >
                    {room.amenities?.join(', ').slice(0, 20) || '-'}...
                  </td>
                  <td className='border border-gray-200 px-2 py-1 w-[120px]'>
                    <div className='flex gap-1'>
                      <div className='relative'>
                        <button
                          title='notes'
                          onClick={() =>
                            setOpenFormRoomId(
                              openFormRoomId === room._id ? null : room._id
                            )
                          }
                          className='text-black bg-gray-300 p-1 rounded-xs cursor-pointer'
                        >
                          <HouseKeeper />
                        </button>

                        {openFormRoomId === room._id && (
                          <div className='absolute z-50 top-8 right-0 bg-white border border-gray-300 shadow-lg p-2 rounded-md w-48'>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault()
                                try {
                                  if (!formData.notes) {
                                    alert('Please enter a notes')
                                    setSubmitting(false)
                                    return
                                  }
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
                        onClick={() => handleDeleteRoom(room._id)}
                        title='Delete'
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
  )
}

export default UnAvailableRooms

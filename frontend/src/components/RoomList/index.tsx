import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pen, Trash2 } from 'lucide-react'
import axios from 'axios'

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
  checkIn: string
  checkOut: string
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  console.log(rooms)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
        setRooms(response.data)
      } catch (err) {
        setError('Failed to fetch rooms. Please try again later please. ' + err)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  //handle delete room
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
    <>
      {/* title */}
      <div className='flex justify-between items-center bg-white py-2 px-8 rounded-lg shadow-[0_0_3px_rgba(0,0,0,0.25)] border-gray-300 mb-4 '>
        <div>
          <h2 className='text-xl text-[#F9862D] font-semiboldborder-ornange-400'>
            ROOM LIST
          </h2>
        </div>

        <Link to='/dashboard/add_new_room'>
          <div className='bg-gray-400 text-white font-semibold px-7 py-2 rounded-lg cursor-pointer hover:bg-orange-500 transition-colors'>
            {' '}
            <h2>+ Add New Room</h2>
          </div>
        </Link>
      </div>
      {/* content */}
      <div className='text-base shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-xl'>
        <div className='overflow-x-auto'>
          <table className='min-w-full border border-gray-300 text-xs bg-white rounded-xl overflow-hidden'>
            <thead className='text-[15px] text-[#00000080]'>
              <tr>
                {[
                  'No #',
                  'Room No/ Bed Size',
                  'Room Name',
                  'Beds/ Bath',
                  'Description',
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
                rooms.map((room, index) => (
                  <tr
                    key={room._id}
                    className='border shadow border-gray-200 hover:bg-gray-100 text-[#00000080]'
                  >
                    <td className='border border-gray-200 px-3 py-3 w-[100px]'>
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </td>

                    <td className='border border-gray-200 w-[150px] px-2 py-3'>
                      {room.bed_size || 'Qeen Bed'}
                    </td>
                    <td className='border border-gray-200 px-2 py-3 w-[330px]'>
                      {room.name || 'N/A'}
                    </td>
                    <td className='border border-gray-200 px-3 py-3 w-[230px]'>
                      {room.baths && room.beds !== null
                        ? `${room.beds} Beds, ${room.baths} Baths`
                        : 'N/A'}
                    </td>
                    <td
                      title={room.description}
                      className='border border-gray-200 px-2 py-3 w-[350px]'
                    >
                      {room.description.slice(0, 31) || 'N/A'}...
                    </td>

                    <td className='border border-gray-200 px-3 py-3 mr-3'>
                      <span>{room.price?.toLocaleString() || 'N/A'}Frw</span>
                    </td>
                    <td
                      title={room.amenities.join(', ')}
                      className='border border-gray-200 px-3 py-3 w-[200px]'
                    >
                      {room.amenities?.join(', ').slice(0, 30) || '-'}...
                    </td>
                    <td className='border border-gray-300 px-2 py-1 w-[120px]'>
                      <div className='flex items-center ml-2 space-x-2'>
                        <Link
                          title='Edit'
                          to={`/dashboard/update-room/${room._id}`}
                          className='text-black bg-gray-300 p-1 rounded-xs'
                        >
                          <Pen size={16} />
                        </Link>
                        {/* <button
                          title="archive"
                          className=" bg-gray-300 p-1 rounded-xs"
                        >
                          <FolderX className="text-black" size={16} />
                        </button> */}

                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          title='Delete'
                          className=' text-[#F9862D] bg-[#f9852d43] p-1 rounded-xs cursor-pointer'
                        >
                          <Trash2 size={16} />
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

export default RoomList

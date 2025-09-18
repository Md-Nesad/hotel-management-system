import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface BasicInfoFormValues {
  photo: File | null;
  name: string;
  roomNumber: string;
  roomType: string;
  status: string;
  basePrice: number;
  discount: number;
  currency: string;
  bedType: string;
  occupancy: number;
  roomSize: number;
  floorNumber: number;
  amenities: string[];
  description: string;
}

interface RoomData {
  _id: string;
  name: string;
  roomNumber: string;
  roomType: string;
  status: string;
  basePrice: number;
  discount: number;
  currency: string;
  bedType: string;
  occupancy: number;
  roomSize: number;
  floorNumber: number;
  amenities: string[];
  images?: string[];
  description?: string;
}

const BasicInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://185.170.58.79:5000/api/rooms/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const data: RoomData = {
            _id: response.data._id,
            name: response.data.name || 'Deluxe Family Room',
            roomNumber: response.data.roomNumber || '101',
            roomType: response.data.roomType || 'Standard',
            status: response.data.status || 'Unavailable',
            basePrice: parseFloat(response.data.price?.replace('$', '').replace('/ per night', '')) || 100,
            discount: response.data.discount || 0,
            currency: response.data.currency || 'USD',
            bedType: response.data.beds || 'Single',
            occupancy: response.data.occupancy || 2,
            roomSize: response.data.roomSize || 25,
            floorNumber: response.data.floorNumber || 1,
            amenities: response.data.amenities || [],
            images: response.data.images || [],
            description: response.data.description || '',
          };
          setRoomData(data);
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      }
    };
    fetchRoomData();
  }, [id]);

  const initialValues: BasicInfoFormValues = {
    photo: null,
    name: roomData?.name || 'Deluxe Family Room',
    roomNumber: roomData?.roomNumber || '101',
    roomType: roomData?.roomType || 'Standard',
    status: roomData?.status || 'Unavailable',
    basePrice: roomData?.basePrice || 100,
    discount: roomData?.discount || 0,
    currency: roomData?.currency || 'USD',
    bedType: roomData?.bedType || 'Single',
    occupancy: roomData?.occupancy || 2,
    roomSize: roomData?.roomSize || 25,
    floorNumber: roomData?.floorNumber || 1,
    amenities: roomData?.amenities || [],
    description: roomData?.description || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Room name is required'),
    roomNumber: Yup.string().required('Room number is required'),
    roomType: Yup.string().required('Room type is required'),
    status: Yup.string().required('Status is required'),
    basePrice: Yup.number().min(0).required('Price is required'),
    discount: Yup.number().min(0).max(100).required('Discount is required'),
    currency: Yup.string().required('Currency is required'),
    bedType: Yup.string().required('Bed type is required'),
    occupancy: Yup.number().min(1).required('Occupancy is required'),
    roomSize: Yup.number().min(10).required('Room size is required'),
    floorNumber: Yup.number().min(1).required('Floor number is required'),
    amenities: Yup.array().min(1, 'Select at least one amenity'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (values: BasicInfoFormValues) => {
    const formData = new FormData();
    if (values.photo) formData.append('photo', values.photo);
    formData.append('name', values.name);
    formData.append('roomNumber', values.roomNumber);
    formData.append('roomType', values.roomType);
    formData.append('status', values.status);
    formData.append('basePrice', values.basePrice.toString());
    formData.append('discount', values.discount.toString());
    formData.append('currency', values.currency);
    formData.append('bedType', values.bedType);
    formData.append('occupancy', values.occupancy.toString());
    formData.append('roomSize', values.roomSize.toString());
    formData.append('floorNumber', values.floorNumber.toString());
    formData.append('amenities', JSON.stringify(values.amenities));
    formData.append('description', values.description);

    try {
      await axios.put(`http://185.170.58.79:5000/api/rooms/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Room information updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      setFieldValue('photo', event.currentTarget.files[0]);
    }
  };

  const roomTypes = ['Standard', 'Deluxe', 'VIP Suite', 'Comfort'];
  const bedTypes = ['Single', 'Double', 'King', 'Queen', '3 Bed'];
  const statusOptions = ['Available', 'Unavailable'];
  const currencyOptions = ['USD', 'EUR', 'GBP'];
  const amenitiesOptions = ['AC', 'TV', 'Balcony', 'Water Heater', 'Mini Fridge'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 w-full">
          <h2 className="text-xl text-center font-bold text-gray-700 mb-2">Basic Information</h2>
          <hr className="border-t border-gray-300 w-full" />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Image Section */}
              <div className="flex gap-4 p-4">
                <div className="w-60 h-40 border-2 border-blue-500 rounded-lg overflow-hidden shadow-md">
                  {values.photo ? (
                    <img src={URL.createObjectURL(values.photo)} alt="Preview" className="w-full h-full object-cover" />
                  ) : roomData?.images?.[0] ? (
                    <img src={roomData.images[0]} alt="Room" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>

                <label htmlFor="photo-upload" className="cursor-pointer w-60 h-40 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-200">
                  <img src="https://cdn-icons-png.flaticon.com/512/716/716784.png" alt="Browse" className="w-6 h-6 mb-2 opacity-70" />
                  <p className="text-gray-500 text-sm">Browse Now</p>
                  <input
                    id="photo-upload"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setFieldValue)}
                    className="hidden"
                  />
                </label>

                <div className="w-60 h-40 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                  <div className="text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/716/716784.png" alt="Browse" className="w-6 h-6 mx-auto mb-2 opacity-70" />
                    <p className="text-gray-500 text-sm">Browse Now</p>
                  </div>
                </div>
              </div>

              {/* Room Number Section */}
              <div className="w-full border-y border-gray-300 py-2 mb-6">
                <h2 className="text-24 font-bold text-center text-gray-700">Room Number</h2>
              </div>
              <div className="space-y-4">
  {/* Row 1: Room Name & Room Number */}
  <div className="flex gap-4">
    <div className="w-1/2">
      <label htmlFor="name" className="block text-20 font-extrabold text-gray-700">Room Name</label>
      <Field
        id="name"
        name="name"
        type="text"
        className="mt-1 block w-full p-2   text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
      />
      <ErrorMessage name="name" component="div" className="text-sm text-red-600" />
    </div>
    <div className="w-1/2">
      <label htmlFor="roomNumber" className="block text-20 font-extrabold text-gray-700">Room Number</label>
      <Field
        id="roomNumber"
        name="roomNumber"
        type="text"
        className="mt-1 block w-full p-2   text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
      />
      <ErrorMessage name="roomNumber" component="div" className="text-10 text-red-600" />
    </div>
  </div>

  {/* Row 2: Room Type & Status */}
  <div className="flex gap-4">
    <div className="w-1/2">
      <label htmlFor="roomType" className="block text-20 font-extrabold text-gray-700">Room Type</label>
      <Field
        as="select"
        id="roomType"
        name="roomType"
        className="mt-1 block w-full p-2   text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
      >
        {roomTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </Field>
      <ErrorMessage name="roomType" component="div" className="text-sm text-red-600" />
    </div>
    <div className="w-1/2">
      <label htmlFor="status" className="block text-20 font-extrabold text-gray-700">Status</label>
      <Field
        as="select"
        id="status"
        name="status"
        className="mt-1 block w-full p-2  text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>{status} </option>
        ))}
      </Field>
      <ErrorMessage name="status" component="div" className="text-sm text-red-600" />
    </div>
  </div>
</div>


              {/* Pricing Information Section */}
              <div className="w-full border-y border-gray-300 py-2 mb-6">
                <h2 className="text-24 font-bold text-center text-gray-700">Pricing Information</h2>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="basePrice" className="block text-20 font-extrabold text-gray-700">Price Per Night</label>
                  <Field
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    className="mt-1 block  text-gray-800 bg-gray-200 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
                  />
                  <ErrorMessage name="basePrice" component="div" className="text-sm text-red-600" />
                </div>
                <div className="flex-1">
                  <label htmlFor="discount" className="block text-20 font-extrabold text-gray-700">Discount (%)</label>
                  <Field
                    id="discount"
                    name="discount"
                    type="number"
                    className="mt-1 block w-full p-2  text-gray-800 bg-gray-200  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
                  />
                  <ErrorMessage name="discount" component="div" className="text-sm text-red-600" />
                </div>
                <div className="flex-1">
                  <label htmlFor="currency" className="block text-20 font-extrabold text-gray-700">Currency</label>
                  <Field
                    as="select"
                    id="currency"
                    name="currency"
                    className="mt-1 block  text-gray-800 bg-gray-200 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="currency" component="div" className="text-sm text-red-600" />
                </div>
              </div>


              {/* Room Details Section */}
              <div>
                <div className="w-full border-y border-gray-300 py-2 mb-6">
                <h2 className="text-24 font-bold text-center text-gray-700">Room Details</h2>
              </div>
            
             <div className="">
  {/* Row with two half-width inputs */}
  <div className="flex gap-6">
  <div className="w-1/2">
    <label htmlFor="bedType" className="block text-20 font-extrabold text-gray-800  ">Bed/Bath Type</label>
    <Field
      as="select"
      id="bedType"
      name="bedType"
      className="mt-1 block w-full p-2  text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
    >
      {bedTypes.map((type) => (
        <option key={type} value={type}>{type}</option>
      ))}
    </Field>
    <ErrorMessage name="bedType" component="div" className="text-sm text-red-600" />
  </div>

  <div className="w-1/2">
    <label htmlFor="occupancy" className="block text-20 font-extrabold text-gray-700">Max Occupancy</label>
    <Field
      id="occupancy"
      name="occupancy"
      type="number"
      className="mt-1 block w-full p-2  text-gray-800 bg-gray-200   border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
    />
    <ErrorMessage name="occupancy" component="div" className="text-sm text-red-600" />
  </div>
</div>


</div>
     
                <div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="roomSize" className="block text-20 font-bold text-gray-700">Room Size (sqm)</label>
                    <Field
                      id="roomSize"
                      name="roomSize"
                      type="number"
                      className="mt-1 block  text-gray-800 bg-gray-200 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
                    />
                    <ErrorMessage name="roomSize" component="div" className="text-sm text-red-600" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="floorNumber" className="block text-20 font-extrabold text-gray-700">Floor Number</label>
                    <Field
                      id="floorNumber"
                      name="floorNumber"
                      type="number"
                      className="mt-1 block  text-gray-800 bg-gray-200 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 "
                    />
                    <ErrorMessage name="floorNumber" component="div" className="text-sm text-red-600" />
                  </div>
                </div>
              </div>
              </div>

              {/* Amenities Section */}
              <div className="w-full border-y border-gray-300 py-2 mb-6">
                <h2 className="text-24 font-bold text-center text-gray-700">Amenities</h2>
              </div>
              <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-200 rounded">
                {amenitiesOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center  text-20  bg-white text-gray-700 px-4 py-2 rounded shadow-sm w-full sm:w-auto"
                  >
                    <Field
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={values.amenities.includes(amenity)}
                      onChange={() => {
                        const currentAmenities = values.amenities.includes(amenity)
                          ? values.amenities.filter((a) => a !== amenity)
                          : [...values.amenities, amenity];
                        setFieldValue('amenities', currentAmenities);
                      }}
                      className="mr-2 text-20 font-bold"
                    />
                    {amenity}
                  </label>
                ))}
                <ErrorMessage name="amenities" component="div" className="text-sm text-red-600 w-full mt-2" />
              </div>

              {/* Description Section */}
              <div className="w-full py-2 mb-4">
                <h2 className="text-20 font-extrabold text-gray-700">Description</h2>
              </div>
              <div className="mb-6 text-gray-600 text-2o font-bold">
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Write here..."
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  rows={4}
                />
                <ErrorMessage name="description" component="div" className="text-sm text-red-600" />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white border border-orange-600 rounded-md hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BasicInfo;
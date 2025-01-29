import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HotelCardItem = ({ hotel={} , index }) => {

const [photoUrl,setphotoUrl] = useState();
  
  useEffect(()=>{
    console.log('Hotel data:', hotel);
    if (hotel?.hotelname) {
      GetPlacePhoto();
    }else {
      console.log('Trip location not available' , hotel);
    }
  },[hotel])

  const GetPlacePhoto=async()=>{
    try {
      const data={
        textQuery: hotel?.hotelname,
      };

      const result = await GetPlaceDetails(data);

      if (result?.places?.length > 0 && result.places[0]?.photos?.length > 0) {
        const photoName = result.places[0].photos[0].name;
        console.log('Photo name from API:', photoName);
        
        const newPhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
        setphotoUrl(newPhotoUrl);
      } else {
        console.warn('No photo found for:', hotel?.hotelname);
        setphotoUrl('/vite.svg'); // Fallback image
      }
    } catch (error) {
      console.log('Error fetching photo:', error);
      setphotoUrl('/vite.svg'); // Fallback image
    }
  };


    return (
        <Link
            to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelname + "," + hotel.hotel_address}
            target='_blank'
        >
            <div className="mt-4 hover:scale-105 transition-all cursor-pointer">
                <img
                    src={photoUrl}
                    alt={hotel.hotelname || 'Hotel'}
                    className="rounded-xl h-[180px] w-full object-cover"
                />
                <div className='my-2 flex flex-col gap-2'>
                    <h2 className="font-bold">{hotel.hotelname || 'N/A'}</h2>
                    <h2 className="text-xs text-gray-500">📍 {hotel.hotel_address || 'Unknown'}</h2>
                    <h2 className='text-sm text-gray-700'>💰 {hotel.price || 'N/A'}</h2>
                    <h2 className='text-sm text-gray-700'>⭐ <strong>Rating:</strong> {hotel.rating || 'N/A'}</h2>
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem;
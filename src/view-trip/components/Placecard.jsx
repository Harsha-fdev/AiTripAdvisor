import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapLocationDot } from "react-icons/fa6";

const Placecard = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState('/default-placeholder.jpg');

  useEffect(() => {
    if (place?.placename) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    try {
      const data = { textQuery: place.placename };
      const result = await GetPlaceDetails(data);

      if (result?.places?.[0]?.photos?.[0]?.name) {
        const newPhotoUrl = PHOTO_REF_URL.replace('{NAME}', result.places[0].photos[0].name);
        setPhotoUrl(newPhotoUrl);
      } else {
        console.warn('No photo found for:', place.placename);
      }
    } catch (error) {
      console.log('Error fetching photo:', error);
    }
  };

  return (
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
      <img 
        src={photoUrl} 
        className='w-[100px] h-[100px] rounded-xl object-cover' 
        alt={place?.placename || "Place image"} 
      />
      <div>
        <h2 className='font-bold text-lg underline'>{place?.placename || "Unknown Place"}</h2>
        <p className='font-medium text-gray-500'>{place?.place_details || "No details available"}</p>
        <Link to={`https://www.google.com/maps/search/?api=1&query=${place?.placename}`} target='_blank'>
          <button className="bg-slate-900 text-white px-3 py-1 rounded-xl mt-2 flex items-center gap-2">
            <FaMapLocationDot />
            View on Map
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Placecard;

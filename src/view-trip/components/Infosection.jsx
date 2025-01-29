import { Button } from '@/components/ui/button';
import { FaShareAltSquare } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

// const PHOTO_REF_URL= 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const Infosection = ({Trip}) => {

  const [photoUrl,setphotoUrl] = useState();
  
  useEffect(()=>{
    if (Trip?.userSelection?.Location?.label) {
      GetPlacePhoto();
    }else {
      console.log('Trip location not available');
    }
  },[Trip])

  const GetPlacePhoto=async()=>{
    try {
      console.log('Fetching place photo for:', Trip?.userSelection?.Location?.label);

      const data={
        textQuery: Trip?.userSelection?.Location?.label,
      };

      const result = await GetPlaceDetails(data);
      console.log('API result:' , result.places[0].photos[0].name);

      const photoUrl = PHOTO_REF_URL.replace('{NAME}' , result.places[0].photos[0].name);
      setphotoUrl(photoUrl);

    } catch (error) {
      console.log('Error:', error);
    }
  }

  return (
    <div>
        <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl'/>
        {/* place info */}

      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
            <h2 className='font-bold text-2xl'>{Trip?.userSelection?.Location?.label}</h2>
            {/* to show hotels basic info */}
            <div className='flex gap-5'>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-md'>📅 {Trip?.userSelection?.noOfDays} Day</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-md'>💵 {Trip?.userSelection?.Budget} Budget</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-md'>🧑‍🤝‍🧑 No. of Traveler : {Trip?.userSelection?.Traveler}</h2>

            </div>
        </div>
        <Button className=""><FaShareAltSquare /></Button>
      </div>

    </div>
  )
}

export default Infosection;
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const UserCardItems = ({ trip = {} }) => {

    const [photoUrl, setphotoUrl] = useState();

    useEffect(() => {
        if (trip?.userSelection?.Location?.label) {
            GetPlacePhoto();
        } else {
            console.log('Trip location not available');
        }
    }, [trip])

    const GetPlacePhoto = async () => {
        try {
            console.log('Fetching place photo for:', trip?.userSelection?.Location?.label);

            const data = {
                textQuery: trip?.userSelection?.Location?.label,
            };

            const result = await GetPlaceDetails(data);
            console.log('API result:', result.places[0].photos[0].name);

            const photoUrl = PHOTO_REF_URL.replace('{NAME}', result.places[0].photos[0].name);
            setphotoUrl(photoUrl);

        } catch (error) {
            console.log('Error:', error);
        }
    }

    return (
        <Link to={'/view-trip/'+trip?.id}>
            <div className='hover:scale-105 transition-all'>
                <img src={photoUrl ? photoUrl : 'vite.svg'} className='object-cover rounded-3xl h-[250px] w-[350px]' />
                <div>
                    <h2 className='font-bold text-lg'>{trip?.userSelection?.Location?.label}</h2>
                    <h2>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.Budget} Budget</h2>
                </div>
            </div>
        </Link>
    )
}

export default UserCardItems
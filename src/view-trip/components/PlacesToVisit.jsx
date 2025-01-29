import React, { useEffect, useState } from 'react';
import Placecard from './Placecard';

const PlacesToVisit = ({ Trip }) => {
  console.log('Rendering PlacesToVisit component');

  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    if (Trip?.tripData?.[0]?.itinerary) {
      const sortedDays = Object.keys(Trip.tripData[0].itinerary).sort((a, b) => {
        const dayA = parseInt(a.replace(/\D/g, ''));
        const dayB = parseInt(b.replace(/\D/g, ''));
        return dayA - dayB;
      });

      setItinerary(
        sortedDays.map(day => ({
          day,
          places: Trip?.tripData[0]?.itinerary[day]?.plan || []  // Use 'plan' instead of 'places'
        }))
      );
    } else {
      setItinerary([]);
    }
  }, [Trip]);


  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Places to visit</h2>

      {itinerary.length === 0 ? (
        <p>No itinerary available</p>
      ) : (
        itinerary.map(({ day, places }, index) => (
          <div key={index}>
            <h2 className="font-bold text-xl">{day}</h2>
            <div className='grid md:grid-cols-2 gap-5'>
              {places.length === 0 ? (
                <p className="text-gray-500">No plans available for {day}</p>
              ) : (
                places.map((place, idx) => (
                  <div key={`${day}-${idx}`} className='my-5'>
                    <h2 className='font-medium text-sm text-orange-600'>⏱️ {place.time_travel || "No time available"}</h2>
                    <Placecard place={place} />
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}

    </div>
  );
};

export default PlacesToVisit;

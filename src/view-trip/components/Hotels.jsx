import HotelCardItem from './HotelCardItem';

const Hotels = ({ Trip = {} }) => {
  console.log("Trip Data:", Trip); // Debugging to check incoming data

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {(!Trip?.tripData || !Array.isArray(Trip?.tripData) || Trip?.tripData?.length === 0) ? (
          <p className="text-gray-500">No hotels available</p>
        ) : (
          Trip?.tripData
            .map((trip, index) => (
              trip?.hotel_options?.length > 0 ? (
                trip?.hotel_options.map((hotel, idx) => (
                  <HotelCardItem  hotel={hotel} key={`${index}-${idx}`}/>
                ))
              ) : (
                <p key={index} className="text-gray-500">No hotels available</p>
              )
            ))
        )}
      </div>

    </div>
  );
};

export default Hotels;

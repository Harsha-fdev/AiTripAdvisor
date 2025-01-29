import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import Infosection from '../components/Infosection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';

const Viewtrip = () => {

    const {tripid} = useParams();

   const [Trip , setTrip] = useState(null);

    useEffect(()=>{
      tripid&&GetTripData();
    } , [tripid]);
//used to get trip info from firebase
    const GetTripData = async()=>{
      try{
        const docRef = doc(db,'AITrips',tripid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
          console.log("Document:",docSnap.data());
          setTrip(docSnap.data());
        }
        else{
          console.log("no such document");
          toast("no trip found..?")
        }
      }
      catch(error){
        console.log("Error : ",error);
      }
    }

  return (

    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>

      {/* Information Section */}
      <Infosection Trip={Trip}/>
      {/* Recommended Hotel */}
      <Hotels Trip={Trip}/>
      {/* Daily Plan */}
      <PlacesToVisit Trip={Trip}/>
      {/* Footer */}

    </div>

  )
}

export default Viewtrip;
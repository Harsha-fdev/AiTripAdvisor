
import { Input } from '@/components/ui/input';
import { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudgetOptions } from '@/constants/options';
import { SelectTravelList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from "sonner"
import { chatSession } from '@/service/AImodel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function Createtrip() {
  const [Place, setPlace] = useState();

  const [OpenDialog, setOpenDialog] = useState(false);

  const [formData, setformData] = useState([]);

  const[loading , setloading] = useState(false);

  //this is to navigate to new page
  const navigate = useNavigate();

  const HandleinputChange = (name, value) => {
    setformData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(formData);
  }, [formData])

//login function
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })


  //this is to generate the trip details  
  const OnGenerateTrip = async () => {

    const user = JSON.parse(localStorage.getItem('user')); 

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (formData?.noOfDays > 10 && !formData?.location || !formData?.Budget || !formData?.Traveler) {
      toast("Please fill all details.")
      return;
    }

    setloading(true);
    //this is to get ai data
    const FINAL_PROMPT = AI_PROMPT
      .replace('{Location}', formData?.Location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.Traveler)
      .replace('{budget}', formData?.Budget)
      .replace('{totalDays}', formData?.noOfDays)


      try {
        const result = await chatSession.sendMessage(FINAL_PROMPT);
        console.log(result?.response?.text());
        SaveAiTrip(result?.response?.text());
      } catch (error) {
        console.error("Error generating trip:", error);
        toast("Error generating trip, please try again.");
      } finally {
        setloading(false);
      }
  }

//firebase related  
  const SaveAiTrip = async (TripData) => {
    setloading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      console.log("Trip saved successfully!" ,  docId);
       //after loading userinfo redirect to new page with id (dynamic navigation)
       navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("Error saving trip, please try again.");
    } finally {
      setloading(false);
    }
  };

  //this is to access userInfo  
  const GetUserProfile = async (token) => {
    // Log token for debugging
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,  // Correct way to pass the token
          Accept: 'application/json'
        }
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data || error.message);
      if (error.response) {
        console.log('Response Status:', error.response.status);
      }
    }
  };


  return (

    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>
        Tell us your Travel preference 🏕️
      </h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will planout for you.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              Place,
              onChange: (v) => { setPlace(v); HandleinputChange('Location', v) }
            }}
          />
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
        <Input placeholder={'Ex-3'} type="number"
          onChange={(e) => HandleinputChange('noOfDays', e.target.value)}
        />
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index}
              onClick={() => HandleinputChange('Budget', item.titles)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
              ${formData?.Budget === item.titles ? 'shadow-lg border-black' : ''}`} >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.titles}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you wish to travel with on your new adventure?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelList.map((item, index) => (
            <div key={index}
              onClick={() => HandleinputChange('Traveler', item.peoples)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                ${formData?.Traveler === item.peoples ? 'shadow-lg border-black' : ''}`}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 flex justify-center'>
        <Button 
        disabled={loading}
        onClick={OnGenerateTrip}>
          {loading?
          <AiOutlineLoading className='h-7 w-7 animate-spin'/>:
            'Generate Trip'
          }
          </Button>
      </div>
  {/* this is dialog box where your loading set your account login takes place*/}
      <Dialog open={OpenDialog} onOpenChange={setOpenDialog}> 
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.jpeg" alt="" className='w-[3.5rem]' />
              <h2 className='font-bold text-lg mt-7 mb-2'>Sign in with Google</h2>
              <p>Sign in to the App with Google Authentication securely</p>

              <Button 
                onClick={login}
                className="w-full mt-5 items-center">
                  <FcGoogle className="h-7 w-7" />Sign in with Google 
              </Button>
              
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Createtrip;
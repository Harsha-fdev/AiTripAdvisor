import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AI_PROMPT, SelectBudgetOptions } from "@/constants/options";
import { SelectTravelList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { chatSession } from "@/service/AImodel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Createtrip() {
  const [Place, setPlace] = useState();
  const [OpenDialog, setOpenDialog] = useState(false);
  const [formData, setformData] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchterm, setSearchterm] = useState("");
  const [placeResults, setPlaceResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  //this is to navigate to new page
  const navigate = useNavigate();

  const HandleinputChange = (name, value) => {
    setformData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  //login function
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  //this is to generate the trip details
  const OnGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfDays > 10 && !formData?.location) ||
      !formData?.Budget ||
      !formData?.Traveler
    ) {
      toast("Please fill all details.");
      return;
    }

    setloading(true);
    //this is to get ai data
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{Location}",
      formData?.Location?.label,
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.Traveler)
      .replace("{budget}", formData?.Budget)
      .replace("{totalDays}", formData?.noOfDays);

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
  };

  //firebase related
  const SaveAiTrip = async (TripData) => {
    setloading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      console.log("Trip saved successfully!", docId);
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
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`, // Correct way to pass the token
            Accept: "application/json",
          },
        },
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
    } catch (error) {
      console.error(
        "Error fetching user info:",
        error.response?.data || error.message,
      );
      if (error.response) {
        console.log("Response Status:", error.response.status);
      }
    }
  };

  // Option 2: Function to handle place search using Nominatim API
  const handlePlaceSearch = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        setPlaceResults([]);
        return;
      }

      setloading(true);

      // Fetch places from Nominatim API (OpenStreetMap)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        // `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchTerm,
            format: "json",
            limit: 5, // Limit results to 5 for better performance
          },
        },
      );

      if (response.data && response.data.length > 0) {
        setPlaceResults(response.data);
      } else {
        // If no results found, clear the place
        // setPlaceResults([]);
        if (!searchTerm || searchTerm.length < 3) {
          setPlaceResults([]);
          return;
        }
        toast("No places found, try a different search.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast("Error searching for places, please try again.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your Travel preference 🏕️</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will planout
        for you.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          {/* Option 2: Replace Google Places with manual input */}
          <Input
            placeholder="Enter a location"
            value={searchterm}
            // onChange={(e) => {
            //   setSearchterm(e.target.value);
            //   handlePlaceSearch(e.target.value);
            // }}
            onChange={(e) => {
              const value = e.target.value;
              setSearchterm(value);

              if (debounceTimeout) {
                clearTimeout(debounceTimeout);
              }

              const timeout = setTimeout(() => {
                handlePlaceSearch(value);
              }, 700);

              setDebounceTimeout(timeout);
            }}
          />
          {/* {Place && <p className="mt-2 text-gray-500">{Place.label}</p>} */}
          {placeResults.length > 0 && (
            <div className="border rounded-md mt-2 max-h-60 overflow-y-auto bg-white shadow-md">
              {placeResults.map((place, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100 border-b"
                  onClick={() => {
                    setPlace({
                      label: place.display_name,
                      lat: place.lat,
                      lon: place.lon,
                    });

                    setSearchterm(place.display_name);

                    HandleinputChange("Location", {
                      label: place.display_name,
                      lat: place.lat,
                      lon: place.lon,
                    });

                    setPlaceResults([]);
                  }}
                >
                  {place.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          How many days are you planning your trip?
        </h2>
        <Input
          placeholder={"Ex-3"}
          type="number"
          onChange={(e) => HandleinputChange("noOfDays", e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => HandleinputChange("Budget", item.titles)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
              ${formData?.Budget === item.titles ? "shadow-lg border-black" : ""}`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.titles}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          Who do you wish to travel with on your new adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => HandleinputChange("Traveler", item.peoples)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                ${formData?.Traveler === item.peoples ? "shadow-lg border-black" : ""}`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex justify-center">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? (
            <AiOutlineLoading className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      {/* this is dialog box where your loading set your account login takes place */}
      <Dialog open={OpenDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.jpeg" alt="" className="w-[3.5rem]" />
              <h2 className="font-bold text-lg">Please Login</h2>
              <p className="my-2">
                You need to be logged in to proceed with the trip generation.
              </p>
            </DialogDescription>
            <DialogTitle>Login with Google</DialogTitle>
          </DialogHeader>
          <div className="mt-5 flex justify-center">
            <Button
              onClick={() => login()}
              className="border-2 border-black w-[18rem] hover:bg-[#dedede]"
            >
              <FcGoogle className="w-7 h-7" /> Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Createtrip;

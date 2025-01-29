import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Dialog, DialogContent, DialogDescription } from '@radix-ui/react-dialog';
import { DialogHeader } from '../ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Import the "X" icon

function Header() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setOpenDialog(false); // Close the dialog when user is set
    }
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log('Login Failed:', error),
  });

  const GetUserProfile = async (token) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${token.access_token}`, 
          Accept: 'application/json'
        }
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();  // Reload the page after logging out
  };

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5">
      <img src="/logo.jpeg" className='w-[3.5rem]' alt="Logo" />
      <div>
        {user ? (
          <div className='flex items-center gap-5'>
            <a href="/create-trip">
            <Button variant="outline" className="rounded-full">+ Create-Trip</Button>
            </a>
            <a href="/my-trips">
            <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img src={user.picture} alt="user" className='h-[35px] w-[35px] rounded-full' />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={handleLogout}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      {/* Full-screen overlay to block interactions */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"></div>
      )}

      {/* Dialog for Google Sign-In outside the header to fix positioning */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="fixed inset-0 z-50 flex justify-center items-center p-5">
          <div className="flex flex-col items-center justify-center text-center p-5 max-w-md w-full rounded-lg shadow-lg bg-white">
            <DialogHeader className="flex justify-between w-full">
              {/* Close button (X mark) */}
              <button onClick={() => setOpenDialog(false)} className="text-xl text-gray-600 ">
                <FaTimes />
              </button>
            </DialogHeader>
            <DialogDescription>
              <img src="/logo.jpeg" alt="App Logo" className='w-[3.5rem] mx-auto' />
              <h2 className='font-bold text-lg mt-7 mb-2'>Sign in with Google</h2>
              <p>Sign in to the App with Google Authentication securely</p>

              <Button
                onClick={login}
                className="w-full mt-5 flex items-center justify-center gap-2 p-3 rounded-md border shadow-md "
              >
                <FcGoogle className="h-7 w-7" /> Sign in with Google
              </Button>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;

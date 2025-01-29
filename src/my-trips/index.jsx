import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCardItems from './components/UserCardItems';

const Mytrips = () => {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        try {
            const user = localStorage.getItem('user');

            if (!user) {
                navigate('/');
                return;
            }

            const userObj = JSON.parse(user);
            setUserTrips([]); // Clear trips before fetching

            const q = query(collection(db, 'AITrips'), where('userEmail', '==', userObj.email));

            const querySnapshot = await getDocs(q);
            const trips = [];
            querySnapshot.forEach((doc) => {
                trips.push({ id: doc.id, ...doc.data() });
            });
            setUserTrips(trips);
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>My Trips</h2>
            <div className='mt-10 grid grid-cols-2 md:grid-cols-3 gap-5'>
                {userTrips.map((trip) => (
                    <UserCardItems key={trip.id} trip={trip} />
                ))}
            </div>
        </div>
    );
};

export default Mytrips;

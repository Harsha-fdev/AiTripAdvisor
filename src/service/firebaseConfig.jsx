// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdZCBPn1BXv0ro9UiJYDDLYfmYQ864EW4",
  authDomain: "ai-travel-advisor-c1e69.firebaseapp.com",
  projectId: "ai-travel-advisor-c1e69",
  storageBucket: "ai-travel-advisor-c1e69.firebasestorage.app",
  messagingSenderId: "68126385254",
  appId: "1:68126385254:web:1947b8bcf31a00590fb9a7",
  measurementId: "G-385BWQE428"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import Createtrip from './create-trip'
import Header from './components/custom/Header'
import { Toaster } from './components/ui/sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Viewtrip from './view-trip/[tripid]/Viewtrip'
import Mytrips from './my-trips'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  }
  ,
  {
    path: '/create-trip',
    element: <Createtrip />,
  },
  {
    path:'view-trip/:tripid',//:means path will be dynamic
    element: <Viewtrip />
  },
  {
    path:'/my-trips',
    element: <Mytrips />
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)


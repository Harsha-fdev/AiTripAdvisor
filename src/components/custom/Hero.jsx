import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

function Hero() {
  return (
    <div className='flex flex-col justify-center items-center mx-5 gap-6 mt-16 lg:mt-24'>
      {/* Main Heading */}
      <h1 className='font-bold text-4xl md:text-5xl text-center leading-tight'>
        <span className='text-[#f56651]'>Discover Your Next Adventure with AI:</span>
        <br />
        Your Personal Guide
      </h1>

      {/* Description */}
      <p className='text-gray-600 text-center text-lg md:text-xl font-normal mt-3 max-w-2xl'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      {/* CTA Button */}
      <Link to={'/create-trip'}>
        <Button className='mt-4'>Get Started, It's Free</Button>
      </Link>

      {/* Hero Image */}
      <img src="/Landing.png" alt="Landing" className='mt-10 mb-10 w-full max-w-lg object-cover rounded-xl shadow-md' />

    </div>
  );
}

export default Hero;

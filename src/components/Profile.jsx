
import React, { useState } from 'react';
import Nav from './Nav';

const feedbackFrequencySquat = {
  0: 5,
  1: 3,
  2: 7,
  3: 2,
};

const feedbackFrequencyPlank = {
  0: 4,
  1: 2,
  2: 5,
  3: 3,
  4: 6,
  5: 1,
};

export default function Profile() {
  // بيانات ثابتة للمستخدم
  const [username, setUsername] = useState('admin');
  const [email, setEmail] = useState('admin@example.com');
  const [age, setAge] = useState('22');
  const [height, setHeight] = useState('1.6');
  const [weight, setWeight] = useState('60');

  // بيانات تمارين ثابتة
  const [squatCorrect, setSquatCorrect] = useState('10');
  const [squatIncorrect, setSquatIncorrect] = useState('2');
  const [plankCorrect, setPlankCorrect] = useState('8');
  const [plankIncorrect, setPlankIncorrect] = useState('1');

  return (
    <>
      <Nav />
      <div className='flex justify-center m-0'>
        <div className='flex flex-col p-4 container'>
          <div className='flex flex-col md:flex-row mb-20'>
            <div className='w-full md:w-4/12 flex justify-center items-center'>
              <img
                src='./images/logo.png'
                alt='Profile'
                className='rounded-lg shadow-xl'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <div className='w-full md:w-8/12 flex flex-col gap-4 p-4'>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  {username}
                </span>
              </div>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  {email}
                </span>
              </div>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  Age: {age}
                </span>
              </div>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  Height: {height} ft
                </span>
              </div>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  Weight: {weight} kg
                </span>
              </div>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  Squat: Correct - {squatCorrect} / Incorrect - {squatIncorrect}
                </span>
              </div>
              <div className='bg-gray-200 rounded-lg flex items-center h-16 shadow p-3'>
                <span className='font-semibold text-lg text-gray-800 mx-auto'>
                  Plank: Correct - {plankCorrect} / Incorrect - {plankIncorrect}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

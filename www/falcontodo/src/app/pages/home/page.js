'use client';

import { UserIcon } from '@heroicons/react/24/outline';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export default function Page() {
  const test_list = [1,2,3,4,5, 6, 7, 8, 9];
  const router = useRouter();
  const modalProfileRef = useRef(null);
  const modalNewTaskRef = useRef(null);
  const 
  const [modelClicked, setProfileClicked] = useState({
    profile: false,
    new_task: true,
  });
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const username = searchParams.get('username');

  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-200 to-blue-500">
      <div className="flex w-full bg-white rounded-xl shadow-lg p-0 flex-row">
        <div className="flex justify-center pt-12 ml-2 pr-40">
          <p>ID: {id}</p>
        </div>
        <div className="mt-0 flex justify-center p-12 pr-40">
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Welcome {username}
          </h2>
        </div>
        <div className="flex justify-center p-12 mr-0 pl-60">
          <button onClick={() => setProfileClicked(true)} className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100">
            <UserIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
        {profileClicked && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalProfileRef}
            className="bg-white rounded-lg shadow-lg p-6 w-96"
          >
            <h2 className="text-3xl font-bold mb-4">Profile</h2>
            <p className="mb-4 text-1xl">Username: {username}</p>
            <p className="mb-4 text-1xl">User ID: {id}</p>
            <button
              onClick={() => {
                router.push('/')
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-10"
            >
              Log Out
            </button>
            <button
              onClick={() => {
                modalProfileRef.current.remove();
                setProfileClicked(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>)}
      </div>
      <div className='flex w-full p-0 flex-row my-5 '>
        <div className='h-100 bg-white rounded-xl shadow-lg p-5 mr-10 ml-5'>
          <p>Coming Soon...</p>
        </div>
        <div className='flex items-center justify-center flex-col bg-green-500/25 rounded-xl shadow-lg p-5 min-w-285 mr-5'>
          <div className='flex justify-center p-5 mb-10'>
            <button onClick={() => setProfileClicked(true)} className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 bg-white mr-100">
              <PlusIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Add Item</span>
            </button>
            {profileClicked && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div
                ref={modalNewTaskRef}
                className="bg-white rounded-lg shadow-lg p-6 w-96"
              >
                <h2 className="text-3xl font-bold mb-4">New Task</h2>
                <p className="mb-4 text-1xl">Username: {username}</p>
                <p className="mb-4 text-1xl">User ID: {id}</p>
                <button
                  onClick={() => {
                    modalNewTaskRef.current.remove();
                    setProfileClicked(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>)}
            <button onClick={() => setProfileClicked(true)} className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 bg-white">
              <MinusIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Remove Item</span>
            </button>
          </div>
          {test_list.map((num) => (
            <div key={num} className='flex justify-center bg-blue-200 rounded-xl shadow-lg p-5 w-200 mb-5'>
              <p>{num}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import { UserIcon } from '@heroicons/react/24/outline';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const username = searchParams.get('username');
  const modalRefObj = {
    profile_ref: useRef(null),
    new_task_ref: useRef(null)
  }
  const [api_call, setApiCall] = useState(false);
  const [getTaskApiCall, setGetTaskApiCall] = useState(true);
  const [modalClickedObj, setModelClicked] = useState({
    profile: false,
    new_task: false,
  });
  const [newTaskInfo, setNewTaskInfo] = useState({
    user_id: id,
    title: "",
    description: "",
    media: null,
    media_path: "",
    time_to_complete: ""
  })
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    async function postMedia() {
      const file = newTaskInfo.media;
      const formData = new FormData();
      formData.append('media', file);

      const res = await fetch('/api/post-media', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if ((data) && (!data.error ) && ('No file uploaded' !== data.error)) {
        setNewTaskInfo((prevState) => ({
          ...prevState,
          media_path: data.path
        }));
        console.log("File successfully uploaded");
      } else {
        console.log("File upload operation failed");
      }

      console.log(newTaskInfo.media_path);
    }

    async function postTask() {
      const res = await fetch("/api/post-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskInfo),
      });

      const data = await res.json();

      if (!data) {
        console.log("Client received no response");
      } else if ("Invalid Format" == data.error) {
        console.log("Invalid format detected on server side");
      } else if ("Server Error" == data.error) {
        console.log("Some thing went wrong on server side");
      }
    }
  
    if (!api_call) return
    postMedia();
    postTask();
    setApiCall(false);
    setGetTaskApiCall(true);
  }, [api_call]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/get-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskInfo),
      });

      const data = await res.json();

      if ((!data) || (data.error)) {
        console.log("Something went wrong fetching existing tasks");
      } else {
        setTaskList(data.results);
        console.log(test_list);
      }
    }

    if (!getTaskApiCall) return;
    fetchTasks();
    setGetTaskApiCall(false);
  }, [getTaskApiCall]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-200 to-blue-500">
      <div className="flex sticky top-0 w-full bg-white rounded-xl shadow-lg p-0 flex-row">
        <div className="flex justify-center pt-12 ml-2 pr-40">
          <p>ID: {id}</p>
        </div>
        <div className="mt-0 flex justify-center p-12 pr-40">
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Welcome {username}
          </h2>
        </div>
        <div className="flex justify-center p-12 mr-0 pl-60">
          <button onClick={() => {
                setModelClicked((prevState) => ({
                  ...prevState,
                  profile: true
                }));
              }} className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100">
            <UserIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
        {modalClickedObj.profile && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalRefObj.profile_ref}
            className="bg-white rounded-lg shadow-lg p-6 w-96"
          >
            <h2 className="text-3xl font-bold mb-4">Profile</h2>
            <p className="mb-4 text-1xl">Username: {username}</p>
            <p className="mb-4 text-1xl">User ID: {id}</p>
            <button
              onClick={() => {
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-10"
            >
              Log Out
            </button>
            <button
              onClick={() => {
                modalRefObj.profile_ref.current.remove();
                setModelClicked((prevState) => ({
                  ...prevState,
                  profile: false
                }));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>)}
      </div>
      <div className='flex w-full p-0 flex-row my-5 '>
        <div className='sticky top-40 h-100 bg-white rounded-xl shadow-lg p-5 mr-10 ml-5'>
          <p>Coming Soon...</p>
        </div>
        <div className='flex items-center justify-center flex-col bg-green-500/25 rounded-xl shadow-lg p-5 min-w-285 mr-5'>
          <div className='flex justify-center p-1 mb-10'>
            <button onClick={() => {
                setModelClicked((prevState) => ({
                  ...prevState,
                  new_task: true
                }));
              }}
            className="flex flex-col items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 bg-white min-w-100">
              <div className="flex flex-row">
                <PlusIcon className="h-5 w-10 text-gray-600" />
                <span className="text-sm font-medium">Add Item</span>
              </div>
            </button>
            {modalClickedObj.new_task && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div
                ref={modalRefObj.new_task_ref}
                className="bg-white rounded-lg shadow-lg p-6 min-w-200 min-h-125"
              >
                <h2 className="text-3xl font-bold mb-15">New Task</h2>
                <div className="flex flex-row mb-5">
                  <p className="text-3xl mr-10">Title: </p>
                  <input
                    id="title"
                    type="text"
                    placeholder="New Task"
                    value={newTaskInfo.title}
                    onChange={(event) => {
                      setNewTaskInfo((prevState) => ({
                        ...prevState,
                        title: event.target.value
                      }))
                    }}
                    className="w-100 rounded-lg border border-gray-300 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-row mb-5">
                  <p className="text-3xl mr-10">Description: </p>
                  <textarea
                    id="description"
                    type="text"
                    placeholder="Need to check garbage"
                    value={newTaskInfo.description}
                    onChange={(event) => {
                      setNewTaskInfo((prevState) => ({
                        ...prevState,
                        description: event.target.value
                      }))
                    }}
                    className="w-100 rounded-lg border border-gray-300 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-row mb-5">
                  <p className="text-3xl mr-10">Supporting Media: </p>
                  <input
                    id="media"
                    type="file"
                    name='media'
                    accept=".png,.jpg,.jpeg,.pdf,.txt,.docx,.pdf"
                    onChange={(event) => {
                      setNewTaskInfo((prevState) => ({
                        ...prevState,
                        media: event.target.files[0]
                      }))
                    }}
                    className="w-100 rounded-lg border border-gray-300 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-row mb-15">
                  <p className="text-3xl mr-10">Deadline: </p>
                  <input
                    id="time_to_complete"
                    type="datetime-local"
                    onChange={(event) => {
                      setNewTaskInfo((prevState) => ({
                        ...prevState,
                        time_to_complete: event.target.valueAsDate
                      }))
                    }}
                    className="w-100 rounded-lg border border-gray-300 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    modalRefObj.new_task_ref.current.remove();
                    setModelClicked((prevState) => ({
                      ...prevState,
                      new_task: false
                    }));
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    modalRefObj.new_task_ref.current.remove();
                    setModelClicked((prevState) => ({
                      ...prevState,
                      new_task: false
                    }));
                    setApiCall(true);
                  }}
                  className="px-4 py-2 ml-10 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </div>)}
            {/* <button onClick={() => setModelClicked(true)} className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 bg-white">
              <MinusIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Remove Item</span>
            </button> */}
          </div>
          {test_list.map((task, idx) => (
            <div key={idx} className='flex justify-center bg-blue-200 rounded-xl shadow-lg p-5 w-200 mb-5'>
              <p>{task.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
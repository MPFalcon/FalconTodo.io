'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const crypto = require('node:crypto');

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dup_password, setDupPassword] = useState("");
  const [cantSubmitAgain, setCantSubmitAgain] = useState(false);
  const [api_call, setApiCall] = useState(false);
  const [status_codes, setStatus] = useState({
    user_exist: false,
    user_registered_failed: false,
    fields_filled: true,
    pass_match: true
  });

  const handleSubmit = (event) => {
    // Prevent default form submission
    event.preventDefault();

    setCantSubmitAgain(false);
    if (!username || !password || !dup_password) {
      setStatus((prevState) => ({
        ...prevState,
        fields_filled: false
      }));
    } else {
      setStatus((prevState) => ({
        ...prevState,
        fields_filled: true
      }));
      setApiCall(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // Hash input password for the following

      const final_pass = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      const args = {
        username: username,
        password: final_pass
      }
    
      const validation_res = await fetch("/api/validate-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });

      const validation_data = await validation_res.json();
      if (validation_data.error == "Success") {
        setStatus((prevState) => ({
          ...prevState,
          user_exist: true
        }));
        return
      } else {
        setStatus((prevState) => ({
          ...prevState,
          user_exist: false
        }));
      }

      const res = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });

      const data = await res.json();
      if (data.error == "Success") {
        setStatus((prevState) => ({
          ...prevState,
          user_registered_failed: false
        }));
        router.push('/');
      } else {
        setStatus((prevState) => ({
          ...prevState,
          user_registered_failed: true
        }));
      }
    }
    
    if (!api_call) return;
    if (password !== dup_password) {
      setStatus((prevState) => ({
        ...prevState,
        pass_match: false
      }));
    } else {
      setStatus((prevState) => ({
        ...prevState,
        pass_match: true
      }));
      fetchData();
    }

    setCantSubmitAgain(false);
    setApiCall(false);
  }, [api_call]);

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        {status_codes.user_exist && 
          <div className="text-center bg-red-500 text-white ">
            User already exist
          </div>
        }
        {status_codes.user_registered_failed && 
          <div className="text-center bg-red-500 text-white ">
            Error Occurred: User didn't register successfully
          </div>
        }
        {!status_codes.pass_match && 
          <div className="text-center bg-red-500 text-white ">
            Passwords must match
          </div>
        }
        {!status_codes.fields_filled && 
          <div className="text-center bg-red-500 text-white ">
            All fields must be filled
          </div>
        }
        <form className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="username"
              placeholder="falconlover02"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="dup_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="dup_password"
              type="password"
              placeholder="••••••••"
              value={dup_password}
              onChange={(event) => setDupPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <button
            disabled={cantSubmitAgain}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            {!cantSubmitAgain ? "Register" : "Registering..."}
          </button>
        </form>
      </div>
    </main>
  );
}

// EOF

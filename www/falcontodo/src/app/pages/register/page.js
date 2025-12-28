'use client'

import React, { useState, useEffect } from "react";
const crypto = require('node:crypto');

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dup_password, setDupPassword] = useState("");
  const [cantSubmitAgain, setCantSubmitAgain] = useState(false);
  const [api_call, setApiCall] = useState(false);
  const [valCreds, setValCreds] = useState(true);
  const [passMatch, setPassMatch] = useState(true);
  const [fieldsFilled, setFieldsFilled] = useState(true);

  const handleSetUserName = (event) => {
    setUsername(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSetDupPassword = (event) => {
    setDupPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    // Prevent default form submission
    event.preventDefault();
    setCantSubmitAgain(false);
    if (!username || !password || !dup_password) {
      setFieldsFilled(false);
    } else {
      setFieldsFilled(true);
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
    
      const res = await fetch("/api/validate-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });

      const data = await res.json();

      if (data.error == "Success") {
        console.log("Invalid Creda!");
        setValCreds(false);
        return
      }

      const res = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });
    }

    if (api_call) {
      if (password !== dup_password) {
        setPassMatch(false);
      } else {
        setPassMatch(true);
        // fetchData();
      }
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
        {!valCreds && 
          <div className="text-center bg-red-500 text-white ">
            User already exist
          </div>
        }
        {!passMatch && 
          <div className="text-center bg-red-500 text-white ">
            Passwords must match
          </div>
        }
        {!fieldsFilled && 
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
              onChange={handleSetUserName}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              onChange={handleSetPassword}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              onChange={handleSetDupPassword}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

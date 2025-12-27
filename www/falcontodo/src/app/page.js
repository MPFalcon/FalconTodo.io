'use client'

import React, { useState, useEffect } from "react";
const crypto = require('node:crypto');

export default function Home() {
  let final_pass = "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [api_call, setApiCall] = useState(false);

  const handleSetUserName = (event) => {
    setUsername(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Hash input password for the following
    final_pass = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    setApiCall(true);
  };

  useEffect(() => {
    async function fetchData() {
      if (!api_call) return
      const args = {
        username: username,
        password: final_pass
      }
    
      const res = await fetch("./backend/validate-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });

      const data = await res.json();
      console.log(data);
    }
    fetchData();
  }, [api_call]);

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log In
        </h2>

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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}

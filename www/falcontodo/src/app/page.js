'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const crypto = require('node:crypto');

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cantSubmitAgain, setCantSubmitAgain] = useState(false);
  const [api_call, setApiCall] = useState(false);
  const [valCreds, setValCreds] = useState(true);

  const handleSubmit = (event) => {
    // Prevent default form submission
    event.preventDefault();
    setCantSubmitAgain(true);
    setApiCall(true);
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
    
      const res = await fetch("/api/validate-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });

      const data = await res.json();

      if (data.error == "Invalid Credentials") {
        setValCreds(false);
      } else if (data.error == "Success") {
        setValCreds(true);
        router.push('/pages/home?id='+data.uuid+'&username='+data.username);
      }
    }

    if (!api_call) return
    fetchData();
    setCantSubmitAgain(false);
    setApiCall(false);
  }, [api_call]);

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log In
        </h2>
        {!valCreds && 
          <div className="text-center bg-red-500 text-white ">
            Username or password was incorrect
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
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            disabled={cantSubmitAgain}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            {!cantSubmitAgain ? "Sign In" : "Signing In..."}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/pages/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

// EOF

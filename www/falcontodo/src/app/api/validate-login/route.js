'use server';

import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  let credentials_match = false;
  let valid_user = {};
  let res = 0;
  const { username, password } = await req.json();

  // Basic validation
  if ((!username || typeof username !== "string") || (!password || typeof password !== "string")) {
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Define and execute the queries
  let query =  `
      SELECT id, username, password
      FROM users
      WHERE username = ?
      ALLOW FILTERING
  `;

  await client.execute(query, [username], { prepare: true })
  .then((result) => {
    const data = result.rows.map(row => ({
      user_id: row.id.toString(),         // UUID → string
      username: row.username.toString(),     
      password: row.password.toString()
    }));

    data.some((entry) => {
      if (entry.password == password) {
        credentials_match = true;
        valid_user = entry;
        return true;
      }    
    });
  })
  .catch((err) => {
    console.error(err);
    res = (-1);
  });

  // Evaluate checks
  if (res == (-1)) {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }

  if (!credentials_match) {
    return NextResponse.json(
      { error: "Invalid Credentials" },
      { status: 400 }
    );  
  }

  // Return OK in success case
  console.log(valid_user);
  return NextResponse.json(
    { error: "Success", uuid: valid_user.user_id, username: valid_user.username },
    { status: 200 }
  );
}
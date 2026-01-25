'use server';

import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  let res = 0;
  const { username, password } = await req.json();

  // Basic validation
  if ((!username || typeof username !== "string") || (!password || typeof password !== "string")) {
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Define and execute the queries to check 
  let query =  `
      INSERT INTO falcon_todo_db.users
        (id, username, password, first_sign_in)
        VALUES (uuid(), ?, ?, toTimeStamp(now()));
  `;

  await client.execute(query, [username, password], { prepare: true })
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

  // Return OK in success case
  return NextResponse.json(
    { error: "Success" },
    { status: 200 }
  );
}

// EOF

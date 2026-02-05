'use server';

import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  const { user_id } = await req.json();

  // Basic validation
  if ((!user_id || typeof user_id !== "string")) {
    console.log(user_id);
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Define and execute the queries
  let query =  `
      DELETE FROM users
      WHERE id = ?;
  `;

  let res = 0;

  await client.execute(query, [user_id], { prepare: true })
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
    { success: true },
    { status: 200 }
  );
}

// EOF

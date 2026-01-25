'use server';

import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  const { task_id } = await req.json();

  // Basic validation
  if ((!task_id || typeof task_id !== "string")) {
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Define and execute the queries
  let query =  `
      DELETE FROM tasks
      WHERE task_id = ?;
  `;

  let res = 0;

  await client.execute(query, [task_id], { prepare: true })
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

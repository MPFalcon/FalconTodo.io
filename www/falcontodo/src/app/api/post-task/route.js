'use server';

import client from "@/app/lib/cassandra";
import fs from 'fs/promises'
import path from 'path'
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  let res = 0;
  const { task_info } = await req.json();

  // Basic validation
  // if ((!username || typeof username !== "string") || (!password || typeof password !== "string")) {
  //   return NextResponse.json(
  //     { error: "Invalid Format" },
  //     { status: 400 }
  //   );
  // }

  // Define and execute the queries to check 
  let query =  `
      INSERT INTO falcon_todo_db.tasks
        (task_id, user_id, title, description, media, time_created, time_needed_to_complete)
        VALUES (uuid(), ?, ?, ?, ?, toTimeStamp(now()), ?);
  `;

  const utcISOString = new Date(task_info.time_to_complete).toISOString()


  await client.execute(query, [username, password], { prepare: true })
  .then((result) => {
    console.log(result);
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

  // Return OK in success case
  return NextResponse.json(
    { error: "Success" },
    { status: 200 }
  );
}
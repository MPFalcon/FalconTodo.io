'use server';

import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  let res = 0;
  const task_info = await req.json();

  // Check if task object exists
  if (!task_info) {
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Basic validation
  if ((!task_info.user_id || typeof task_info.user_id !== "string") || 
  (!task_info.title || typeof task_info.title !== "string") || 
  (!task_info.description || typeof task_info.description !== "string") ||
  (!task_info.time_to_complete || typeof task_info.time_to_complete !== "string")) {
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Define and execute the queries to check 
  let query =  `
      INSERT INTO falcon_todo_db.tasks
        (task_id, user_id, title, description, media, time_created, time_needed_to_complete)
        VALUES (uuid(), ?, ?, ?, ?, toTimeStamp(now()), ?);
  `;
  
  const utcISOString = new Date(task_info.time_to_complete).toISOString();

  await client.execute(query, [task_info.user_id, task_info.title, task_info.description, task_info.media_path , utcISOString], { prepare: true })
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
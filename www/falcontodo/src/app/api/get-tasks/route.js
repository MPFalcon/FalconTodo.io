'use server';

import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  const { user_id } = await req.json();

  // Basic validation
  if ((!user_id || typeof user_id !== "string")) {
    return NextResponse.json(
      { error: "Invalid Format" },
      { status: 400 }
    );
  }

  // Define and execute the queries
  let query =  `
      SELECT *
      FROM tasks
      WHERE user_id = ?
      ALLOW FILTERING
  `;

  let data = [];
  let res = 0;

  await client.execute(query, [user_id], { prepare: true })
  .then((result) => {
    data = result.rows.map(row => ({
      task_id: row.task_id.toString(),         // UUID → string
      user_id: row.user_id.toString(),     
      description: row.description.toString(),
      media: row.media.toString(),
      time_created: row.time_created.toString(),
      time_to_complete: row.time_needed_to_complete.toString(),
      title: row.title.toString()
    }));
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
  // console.log(valid_user);
  return NextResponse.json(
    { success: true, results: data },
    { status: 200 }
  );
}
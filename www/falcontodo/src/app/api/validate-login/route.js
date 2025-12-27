import client from "@/app/lib/cassandra";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Receive arguments
  const { username, password } = await req.json();

  console.log("Username: "+username+"; Password: "+password);
  // const username = "TEST"
  // const password = "TEST"

  // Basic validation
  // if (!username || typeof username !== "string") {
  //   return NextResponse.json(
  //     { input: username },
  //     { error: "Invalid Username" },
  //     { status: 400 }
  //   );
  // }

  // if (!password || typeof password !== "string") {
  //   return NextResponse.json(
  //     { input: password },
  //     { error: "Invalid Password" },
  //     { status: 400 }
  //   );
  // }

  // Define and execute the queries
  let query =  `
      SELECT username, password
      FROM users
      WHERE username = ?
      ALLOW FILTERING
    `;
  console.log('Querying Database...');
  let first_query = await client.execute(query, [username], { prepare: true })
  .then((result) => {
    const data = result.rows.map(row => ({
      username: row.username.toString(),     // UUID → string
      password: row.password.toString()
    }));
    console.log(data);
    // console.log('Credentials matched!\n\nUsername: ' + data[0].username + '\nPassword: ' + data[0].password);

    return NextResponse.json(data);
  })
  .catch((err) => {
    console.error(err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  });


  return NextResponse.json({ success: true });
}
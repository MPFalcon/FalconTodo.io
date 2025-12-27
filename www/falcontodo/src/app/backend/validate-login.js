import client from "../lib/cassandra";

export default async function validateLogIn(req, res) {
  // Receive arguments
  const { username, password } = req.body;

  // Basic validation
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Invalid Username" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid Password" });
  }

  // Define and execute the queries
  let query = "SELECT username, password FROM falcon_todo_db.users WHERE username=\'?\' AND password=\'?\' ALLOW FILTERING;"
  console.log('Querying Database...')
  let first_query = await client.execute(query, [username, password], { prepare: true })
  .then((result) => {
    console.log('Credentials matched!\n\nUsername: ' + result.rows[0].username + '\nPassword: ' + result.rows[0].password);
    const data = result.rows.map(row => ({
      username: row.username.toString(),     // UUID → string
      password: row.password.toString()
    }));

    res.status(200).json(data);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  });
}
'use server'

import cassandra from 'cassandra-driver';

// Initiate Cassandra API
// Replace 'Username' and 'Password' with the username and password from your cluster settings
let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
// Replace the PublicIPs with the IP addresses of your clusters
let contactPoints = ['localhost'];
// Replace DataCenter with the name of your data center, for example: 'AWS_VPC_US_EAST_1'
let localDataCenter = 'FalconTodoDB';

export async function validateLogIn(username, hashed_pass) {
    // Instantiate DB client
    let client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, localDataCenter: localDataCenter, keyspace:'falcon_todo_db'});
 
    // Define and execute the queries
    let query = "SELECT username, password FROM falcon_todo_db.users WHERE username=? AND password=? ALLOW FILTERING;"
    console.log('Querying Database...')
    let q1 = await client.execute(query, [username, hashed_pass])
    .then((result) => {
      console.log('Credentials matched!\n\nUsername: ' + result.rows[0].username + '\nPassword: ' + result.rows[0].password);
    })
    .catch((err) => {
      console.log('Query Error: ', err);
    });

    // Exit the program after all queries are complete
    Promise.allSettled([q1]).finally(() => client.shutdown());
}
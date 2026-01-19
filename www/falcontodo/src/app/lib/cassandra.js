'use server';

import cassandra from "cassandra-driver";

// Initiate Cassandra API
// Replace 'Username' and 'Password' with the username and password from your cluster settings
let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
// Replace the PublicIPs with the IP addresses of your clusters
let contactPoints = ['127.0.0.1'];
// Replace DataCenter with the name of your data center, for example: 'AWS_VPC_US_EAST_1'
let localDataCenter = 'datacenter1';

// Instantiate DB client
let client = new cassandra.Client({
    contactPoints: contactPoints, 
    authProvider: authProvider, 
    localDataCenter: localDataCenter, 
    keyspace:'falcon_todo_db'
});

export default client
CREATE KEYSPACE IF NOT EXISTS falcon_todo_db WITH REPLICATION =
{
    'class' : 'SimpleStrategy',
    'replication_factor' : '1'
};

CREATE TABLE IF NOT EXISTS falcon_todo_db.users (
    id int PRIMARY KEY,
    username text,
    password text,
    first_sign_in timestamp
);

INSERT INTO falcon_todo_db.users
    (id, username, password, first_sign_in)
    VALUES (0, 'admin', '7cf505c825164e97ddb64f3c55613e51530bac2da08812e12d1ab85311cfa289', toTimeStamp(now()));

-- EOF

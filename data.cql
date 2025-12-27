CREATE KEYSPACE IF NOT EXISTS falcon_todo_db WITH REPLICATION =
{
    'class' : 'SimpleStrategy',
    'replication_factor' : 1
};

CREATE TABLE IF NOT EXISTS falcon_todo_db.users (
    id int PRIMARY KEY,
    username text,
    password text,
    first_sign_in timestamp
);

INSERT INTO falcon_todo_db.users
    (id, username, password, first_sign_in)
    VALUES (0, 'admin', '5b109f1ba408ea6d776f2bb8ce8af45db4bdd5e6ddefcafa73d8c7abad370c76', toTimeStamp(now()));

-- EOF

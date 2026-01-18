CREATE KEYSPACE IF NOT EXISTS falcon_todo_db WITH REPLICATION =
{
    'class' : 'SimpleStrategy',
    'replication_factor' : 1
};

CREATE TABLE IF NOT EXISTS falcon_todo_db.users (
    id uuid PRIMARY KEY,
    username text,
    password text,
    first_sign_in timestamp
);

CREATE TABLE IF NOT EXISTS falcon_todo_db.tasks (
    task_id uuid PRIMARY KEY,
    user_id uuid,
    title text,
    description text,
    media blob,
    time_created timestamp,
    time_needed_to_complete timestamp,
    FOREIGN KEY (user_id) REFERENCES falcon_todo_db.users(id)
);

INSERT INTO falcon_todo_db.users
    (id, username, password, first_sign_in)
    VALUES (uuid(), 'admin', '5b109f1ba408ea6d776f2bb8ce8af45db4bdd5e6ddefcafa73d8c7abad370c76', toTimeStamp(now()));

-- EOF

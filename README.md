# FalconTodo.io

Open source full stack TODO tracker written in Javascript using the React framework

## Dependencies

Only Docker and Docker Compose is needed

 - For Linux - `sudo apt-get install docker-io docker-compose-plugin -yq`

 - For Windows - *TBD*

## How to Build and Run - Linux

The infrastructure of the project is set up in a way that is as isolated as possible from the host machine using Docker Compose.  This means that others that want to use this software shouldn't have to worry about their actual machine getting bloated with dependencies only used for this project.

There are two containers present; One contains the web service *(None.js)* and the other contains the database service *(Apache Cassandra)*

 - Run `docker compose watch` to initiate it.  It may take a few minutes and output is verbose, so you'll be ale to tell when it is done

 - You'll have to *manually* run the following command to populate the database with the provide schema **(data.cql)**: `docker compose exec cassandra cqlsh -f /docker-entrypoint-initdb.d/data.cql`

 - The database at this point should be fully functional and the web service will be available at `http://localhost:8080`

## How to Build and Run - Windows

## Recap

That's it! You have a functional full stack application that can be used for you, your family, or your small business. Thanks for using!

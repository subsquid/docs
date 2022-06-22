# Local runs

This guide considers that a Squid project has been created or that the [Squid template](https://github.com/subsquid/squid-template) repository has been cloned and maybe customized.

To run a Squid project locally, it is necessary to launch its 3 main components:

* The database (by default, this is a PostgreSQL instance in a docker container)
* The Processor
* The GraphQL server

Let's see how to launch each one of them.

## Launch the database

In the project's main folder, there is a `docker-compose.yml` file, defining the services a Squid depends on. The only service necessary so far is the database and as such it is the only entry in the YAML file.

In order to launch the database dependency, simply run this in a command line window, from the project's main folder:

```bash
docker-compose db up -d
```

The `-d` additional parameter will launch the instance as a daemon, making sure it will not block the terminal window

## Launch the processor

The processor should probably be considered the main component of a Squid, as, when launched, it will start fetching data from the Archive and transforming it. To start it, simply navigate to the project's main folder in a console window and launch the following command:

```bash
node -r dotenv/config lib/processor.js
```

The `-r` parameter will make sure the processor reads the `.env` file that comes with the project, which defines variables for the Postgres database port and which port to expose for the GraphQL server.

These can alternatively be defined as environment variables.

## Launch the GraphQL server

How good would data be if it idly sat in the database? For an API to be complete, it needs its data to be accessible. To do so, we need to launch the GraphQL gateway, by navigating to the project's main folder in a console window and launching the following command:

```bash
npm run query-node:start
```

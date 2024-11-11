---
sidebar_position: 65
title: Query optimization
description: Ensuring your squid's perfomance
---

# Query optimization

Before going to production, ensure that none of the queries that your app generates are executed suboptimally. Failure to do so can cause severe performance issues.

The optimization procedure involves executing a representative sample of your app's queries, analyzing the slow queries and iteratively adding any helpful indexes. For that you'll need a development deployment of your squid. You can choose to use either a Cloud dev deployment or a local one.

## Using a Cloud dev deployment

**Pros:**
 - You don't need to run a local squid copy.
 - You end up with a fully tested squid deployment in the end and can reuse that exact deployment in production.

**Cons:**
 - Each iteration of the optimization process is relatively complex and slow.

Recommended for squids serving simple database queries.

1. Create a development deployment of your squid.
   - Use the squid name that you intend to be using in production, a new slot and (optionally) a dev tag. See the [Slots and tags guide](/cloud/resources/slots-and-tags).

2. Wait for you dev deployment to sync.

3. Configure your dev deployment to log mildly slow SQL queries.
   - Set the `log_min_duration_statement` to some low value in your manifest:
     ```yaml title=squid.yaml
     deploy:
       addons:
         postgres:
           config:
             log_min_duration_statement: 50
     ...
     ```
     I'm using 50 ms = 0.05 s here. All queries that take longer than that to execute will now be logged by the `db` container.
   - Update your dev deployment, e.g. with
     ```bash
     sqd deploy -s <dev-slot> .
     ```

4. Send a representative set of queries to your dev deployment. For this step you can use automated or manual tests of your API consumer app.

5. View the slow queries using [`sqd logs`](/squid-cli/logs), e.g.
   ```bash
   sqd logs -f -n <my-squid-name> -s <dev-slot> -c db
   ```

6. Connect to your dev deployment's database with `psql`. You can find the connection command by going to the [squids view of the network app](https://app.subsquid.io/squids) > your dev deployment's page > "DB access" tab.

7. Execute the slow queries with [`EXPLAIN ANALYZE`](https://www.postgresql.org/docs/current/sql-explain.html) and view their execution plans.

8. Hypothesize about which indexes that could be used to speed up your queries.

9. Update the indexes of your dev deployment's database:
   - Ensure that your local database container schema is the same as the schema of your dev deployment's database. Assuming that the codebases are the same,
     ```bash
     docker compose up -d
     npm run build
     npx squid-typeorm-migration apply
     ```
     should do the trick. If you encounter problems, wipe the database with `docker compose down` and repeat the step.
   - Add or remove some [`@index` statements](/sdk/reference/schema-file/indexes-and-constraints) to your squid's schema file.
   - Regenerate the TypeORM model classes.
     ```bash
     npx squid-typeorm-codegen
     ```
   - Build your code.
     ```bash
     npm run build
     ```
   - Generate an incremental migration file.
     ```bash
     npx squid-typeorm-migration generate
     ```
   - Update your dev deployment in the Cloud without resetting its database, e.g.
     ```bash
     sqd deploy -s <dev-slot> .
     ```

   Main guide is in [this section](/sdk/resources/persisting-data/typeorm/#updating-a-deployed-squid-schema).

10. Repeat steps 4-9 until there are no more slow queries.

11. Set a less strict rule for logging slow queries, e.g. as follows
     ```yaml title=squid.yaml
     deploy:
       addons:
         postgres:
           config:
             log_min_duration_statement: 1000 # 1 second
     ...
     ```
     Update the deployment:
     ```bash
     sqd deploy -s <dev-slot> .
     ```

12. Mark your development deployment for production use.
    - If you used a development tag, remove it with [`sqd tags remove`](/squid-cli/tags/#sqd-tags-remove)
    - Add a production tag to the deployment with [`sqd tags add`](/squid-cli/tags/#sqd-tags-add)

    See also the [Zero-downtime updates section](/cloud/resources/slots-and-tags/#zero-downtime-updates).

## Using a local squid

**Pros:**
 - Iterations of the optimization process are relatively simple and quick.

**Cons:**
 - You will have to run a local squid copy, potentially requiring you to keep your local machine powered for hours.
 - The final squid still need to be tested in the production environment. Doing such a test properly amounts to performing one iteration of the [Cloud-based optimization approach](#using-a-cloud-dev-deployment).

Recommended for squids serving complex queries.

1. Start the local instance of your squid as usual. For now you only need the processor.
   ```bash
   docker compose up -d
   npm run build
   npx squid-typeorm-migration apply
   node -r dotenv/config lib/main.js
   ```

2. Wait for your squid to sync, then stop the processor process with Ctrl-C.

3. Configure your local database container to log all SQL queries.
   ```yaml title=docker-compose.yml
   services:
     db:
       image: postgres:15
       command: ["postgres", "-c", "log_statement=all"]
   ...
   ```
   Recreate the container without dropping the database with
   ```bash
   docker compose up -d
   ```

4. If you're querying the database via a GraphQL API, start it.
   - On Postgraphile: usually `node -r dotenv/config lib/api.js`
   - On Hasura (dedicated instances): the Hasura instance should have been started alongside the database, so just [apply the configuration](/sdk/resources/tools/hasura-configuration/#applying-the-configuration) with `npx squid-hasura-configuration apply`.
   - On Openreader: `npx squid-graphql-server`.

   See also the [Serving GraphQL guide](/sdk/resources/serving-graphql).

5. Send a representative set of queries to your local squid instance. For this step you can use automated or manual tests of your API consumer app.

6. View the queries using `docker logs`:
   ```bash
   docker logs <db-container-name>
   ```
   You can look up the container name with `docker ps`.

7. Connect to your dev deployment's database with `psql`:
   ```bash
   PGPASSWORD="postgres" psql -h localhost -d squid -U postgres -p 23798
   ```
   If this doesn't work, check your `.env` file for your unique database creds.

8. Execute the queries with [`EXPLAIN ANALYZE`](https://www.postgresql.org/docs/current/sql-explain.html) and view their execution plans.

9. Hypothesize about which indexes that could be used to speed up your queries.

10. Update the indexes of your local squid's database:
    - Add or remove some [`@index` statements](/sdk/reference/schema-file/indexes-and-constraints) to your squid's schema file.
    - Regenerate the TypeORM model classes.
      ```bash
      npx squid-typeorm-codegen
      ```
    - Build your code.
      ```bash
      npm run build
      ```
    - Generate an incremental migration.
      ```bash
      npx squid-typeorm-migration generate
      ```
    - Create the indexes in your local database.
      ```bash
      npx squid-typeorm-migration apply
      ```

11. Repeat steps 5-10 until you're satisfied with the performance.

12. (optional) Merge all migrations into a single file.

    **WARNING:** commands below will wipe your database. You'll need to re-sync your squid if you decide to go back after this step.

    ```bash
    docker compose down
    docker compose up -d
    npm run build
    rm -r db
    npx squid-typeorm-migration generate
    ```

13. Go through the [Using a Cloud dev deployment](#using-a-cloud-dev-deployment) guide. If all is well, you should find no slow queries and be done in a single iteration.

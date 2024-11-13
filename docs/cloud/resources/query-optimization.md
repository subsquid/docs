---
sidebar_position: 65
title: Query optimization
description: Ensuring your squid's perfomance
---

# Query optimization

Before going to production, ensure that none of the queries that your app generates are executed suboptimally. Failure to do so can cause severe performance issues.

The optimization procedure involves executing a representative sample of your app's queries, analyzing the slow queries and iteratively adding any helpful indexes. Here is the procedure:

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
   - Aim to use as few indexes as possible: having more than necessary can hurt the performance.
   - One possible strategy is to use ChatGPT. Just give it the execution plan and ask which indexes should be added. If it struggles give it your database schema as well (e.g. in form of your `schema.graphql` file listing). It is also useful to ask it to explain its suggestion.

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
    - If your queries are complicated, you can skip step 9 and add indexes manually in `psql`, e.g. like this
      ```sql
      CREATE INDEX "my_idx" ON my_table (column);
      ```
      This can drastically reduce the time you spend per iteration, but then you'll have to manually add the combination of indexes that worked to `schema.graphql` and redo the whole optimization procedure once more to ensure consistency. Otherwise, you may run into unexpected performance issues due to lost/changed indexes as you redeploy or modify your squid.

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

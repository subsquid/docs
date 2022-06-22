# db

The `db` topic of the `sqd` command line interface is used to manage the database of your Squid project. This is often necessary after having modified the `schema.graphql` with new or different entities and having generated model classes via the `codegen` command.

Thanks to this command, it is possible to:

* create a new database
* drop an existing database
* create a new migration file, describing changes that need to be applied to the database
* apply a migration
* revert a migration

## Subcommands for `db` command

| Subcommand         | Description                                                              | Arguments                              |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------- |
| `create`           | Create database                                                          |                                        |
| `create-migration` | Analyze database state and generate migration to match the target schema | `[NAME]` migration filename (optional) |
| `drop`             | Drop the database                                                        |                                        |
| `migrate`          | Apply database migrations                                                |                                        |
| `new-migration`    | Create template file for a new migration                                 | `[NAME]` migration filename (optional) |
| `revert`           | Revert the last performed migration                                      |                                        |

## Examples

#### Create a new database (database name from ENV variable)

```
sqd db create
```

#### Drop existing database (database name from ENV variable)

```
sqd db drop
```

#### Create new migration

The tool will look at differences between the `schema.graphql` file and the database schema, and it will create a file containing queries necessary to apply these changes to the database.

```
sqd db create-migration Initial
```

#### Apply migration

```
sqd db migrate
```

#### Create migration template

This command will create an empty migration file, to be manually filled to apply changes to the database.

```
sqd db new-migration Initial
```

Some examples of how to use this command can be seen in the [Tutorial to create a simple Squid](../../tutorial/create-a-simple-squid.md#apply-changes-to-the-database).

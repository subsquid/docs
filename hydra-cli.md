# Hydra CLI

A cli tool for running a [Hydra](https://joystream.org/hydra) query node

## Install

Using `npx`:

```bash
$ alias hydra-cli='npx @subsquid/hydra-cli'
```

or install via npm:

```bash
npm install -g @subsquid/hydra-cli
```

and then

```bash
$ hydra-cli [COMMAND]
```

## Quickstart

Run

```text
$ hydra-cli scaffold
```

and answer the prompts. This will generate a sample project and README with setup instructions.

## Commands

<!-- commands -->
* [`hydra-cli codegen`](#hydra-cli-codegen)
* [`hydra-cli db:create`](#hydra-cli-dbcreate)
* [`hydra-cli db:create-migration [NAME]`](#hydra-cli-dbcreate-migration-name)
* [`hydra-cli db:drop`](#hydra-cli-dbdrop)
* [`hydra-cli db:migrate`](#hydra-cli-dbmigrate)
* [`hydra-cli db:new-migration [NAME]`](#hydra-cli-dbnew-migration-name)
* [`hydra-cli db:revert`](#hydra-cli-dbrevert)
* [`hydra-cli help [COMMAND]`](#hydra-cli-help-command)
* [`hydra-cli scaffold`](#hydra-cli-scaffold)
* [`hydra-cli squid:create`](#hydra-cli-squidcreate)
* [`hydra-cli squid:update`](#hydra-cli-squidupdate)
* [`hydra-cli squid:release`](#hydra-cli-squidrelease)
* [`hydra-cli squid:ls`](#hydra-cli-squidls)
* [`hydra-cli squid:kill`](#hydra-cli-squidkill)
* [`hydra-cli squid:tail`](#hydra-cli-squidtail)
## `hydra-cli codegen`

Analyze graphql schema and generate model/server files

```
Analyze graphql schema and generate model/server files

USAGE
  $ hydra-cli codegen

OPTIONS
  -s, --schema=schema  [default: ./schema.graphql] Schema path, can be file or directory
```


## `hydra-cli db:create`

Create target database

```
Create target database

USAGE
  $ hydra-cli db:create
```


## `hydra-cli db:create-migration [NAME]`

Analyze database state and generate migration to match the current schema

```
Analyze database state and generate migration to match the current schema

USAGE
  $ hydra-cli db:create-migration [NAME]
```


## `hydra-cli db:drop`

Drop target database

```
Drop target database

USAGE
  $ hydra-cli db:drop
```


## `hydra-cli db:migrate`

Apply database migrations

```
Apply database migrations

USAGE
  $ hydra-cli db:migrate
```


## `hydra-cli db:new-migration [NAME]`

Create a file for a new migration

```
Create a file for a new migration

USAGE
  $ hydra-cli db:new-migration [NAME]
```


## `hydra-cli db:revert`

Revert the last performed migration

```
Revert the last performed migration

USAGE
  $ hydra-cli db:revert
```


## `hydra-cli help [COMMAND]`

display help for hydra-cli

```
display help for <%= config.bin %>

USAGE
  $ hydra-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```


## `hydra-cli scaffold`

Starter kit: generates a directory layout and a sample schema file

```
Starter kit: generates a directory layout and a sample schema file

USAGE
  $ hydra-cli scaffold

OPTIONS
  -a, --appPort=appPort          [default: 4000] GraphQL server port
  -b, --blockHeight=blockHeight  [default: 0] Start block height
  -d, --dir=dir                  [default: CWD] Project folder
  -h, --dbHost=dbHost            [default: localhost] Database host
  -i, --indexerUrl=indexerUrl    Hydra Indexer endpoint
  -n, --name=name                [default: hydra-scaffold] Project name
  -p, --dbPort=dbPort            [default: 5432] Database port
  -u, --dbUser=dbUser            [default: postgres] Database user
  -x, --dbPassword=dbPassword    [default: postgres] Database user password
  --rewrite                      Clear the folder before scaffolding
  --silent                       If present, the scaffolder is non-interactive and uses only provided CLI flags
```

## `hydra-cli auth`

Manage credentials for the hydra-cli

```
Manage credentials for the hydra-cli

USAGE
  $ hydra-cli auth

OPTIONS
  -k, --key=key                (required) access key, obtained from squid web-page
```

## `hydra-cli squid:create`

Creates a new squid

```
Creates a new squid for authenticated user

USAGE
  $ hydra-cli squid:create <squid_name>

OPTIONS
  -d, --description=description  description
  -l, --logo=logo                logo url
  -w, --website=website          website url
```

## `hydra-cli squid:update`

Edits squid information

```
Edits squid information

USAGE
  $ hydra-cli squid:update <squid_name>

OPTIONS
  -d, --description=description  description
  -l, --logo=logo                logo url
  -s, --source=source            source code url 
  -w, --website=website          website url
```

## `hydra-cli squid:release`

Release a Squid (means deploying a version of the squid)

```
Release a Squid (means deploying a version of the squid)

USAGE
  $ hydra-cli squid:release <squid_name>@<version_name>

OPTIONS
  -s, --source=source                  deploy url. If presents, will be used instead git remote url
  -d, --description=description        description of version
```

## `hydra-cli squid:ls`

Display all squids or it's versions

```
Display all squids or it's versions

USAGE
  $ hydra-cli squid:ls

OPTIONS
  -n, --name=name                squid name. If presents, display all versions of this squid
  -t, --truncate                 [default: false] Truncate output to fit screen
```

## `hydra-cli squid:kill`

Kill a squid or it's version

```
Kill a squid or it's version

USAGE
  $ hydra-cli squid:kill <squid_name>
  $ hydra-cli squid:kill <squid_name>@<version_name>
```

## `hydra-cli squid:tail`

Tail squid logs

```
Tail squid logs

USAGE
  $ hydra-cli squid:tail <squid_name>@<version_name>

OPTIONS
  -f, --follow=follow               [default: false] Will continue streaming the new logs
  -l, --lines=lines                 [default: 50] Output a specific number of lines (if "follow" is false)
```
<!-- commandsstop -->

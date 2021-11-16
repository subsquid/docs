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
* [`hydra-cli app:create`](#hydra-cli-appcreate)
* [`hydra-cli app:update`](#hydra-cli-appupdate)
* [`hydra-cli app:deploy`](#hydra-cli-appdeploy)
* [`hydra-cli app:ls`](#hydra-cli-appls)
* [`hydra-cli app:delete`](#hydra-cli-appdelete)

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

## `hydra-cli app:create`

Create an app

```
Create a new app

USAGE
  $ hydra-cli app:create

OPTIONS
  -n, --name=name                (required) new app name
  -s, --source=source            (required) source code url
  -d, --description=description  description
  -l, --logo=logo                logo url
  -w, --website=website          website url
```

## `hydra-cli app:update`

Update an app

```
Update an app

USAGE
  $ hydra-cli app:update

OPTIONS
  -n, --name=name                (required) app name
  -d, --description=description  description
  -l, --logo=logo                logo url
  -s, --source=source            source code url 
  -w, --website=website          website url
```

## `hydra-cli app:deploy`

Create a new deployment

```
Create a new deployment

USAGE
  $ hydra-cli app:deploy

OPTIONS
  -n, --name=name                (required) app name
  -v, --version=version          (required) deployment version name
```

## `hydra-cli app:ls`

Display all apps or deployments

```
Display all apps or deployments

USAGE
  $ hydra-cli app:ls

OPTIONS
  -n, --name=name                app name. If present, display all deployments of this app
  -t, --truncate                 [default: false] Truncate output to fit screen
```

## `hydra-cli app:delete`

Delete an app or deployment

```
Delete an app or deployment

USAGE
  $ hydra-cli app:delete

OPTIONS
  -n, --name=name                (required) app name
  -v, --version=version          deployment version name. If specified, will be deleted deployment with specific version
```
<!-- commandsstop -->

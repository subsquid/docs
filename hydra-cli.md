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

* [`hydra-cli codegen`](hydra-cli.md#hydra-cli-codegen)
* [`hydra-cli help [COMMAND]`](hydra-cli.md#hydra-cli-help-command)
* [`hydra-cli plugins`](hydra-cli.md#hydra-cli-plugins)
* [`hydra-cli plugins:inspect PLUGIN...`](hydra-cli.md#hydra-cli-pluginsinspect-plugin)
* [`hydra-cli plugins:install PLUGIN...`](hydra-cli.md#hydra-cli-pluginsinstall-plugin)
* [`hydra-cli plugins:link PLUGIN`](hydra-cli.md#hydra-cli-pluginslink-plugin)
* [`hydra-cli plugins:uninstall PLUGIN...`](hydra-cli.md#hydra-cli-pluginsuninstall-plugin)
* [`hydra-cli plugins:update`](hydra-cli.md#hydra-cli-pluginsupdate)
* [`hydra-cli preview`](hydra-cli.md#hydra-cli-preview)
* [`hydra-cli scaffold`](hydra-cli.md#hydra-cli-scaffold)

## `hydra-cli codegen`

Code generator

```text
Code generator

USAGE
  $ hydra-cli codegen

OPTIONS
  -d, --createDb       Create the DB and install migrations
  -s, --schema=schema  [default: ../../schema.graphql] Schema path, can be file or directory
  --[no-]install       Install dependencies
```

## `hydra-cli help [COMMAND]`

display help for hydra-cli

```text
display help for <%= config.bin %>

USAGE
  $ hydra-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code:_ [_@oclif/plugin-help_](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)

## `hydra-cli plugins`

list installed plugins

```text
list installed plugins

USAGE
  $ hydra-cli plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ hydra-cli plugins
```

_See code:_ [_@oclif/plugin-plugins_](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/index.ts)

## `hydra-cli plugins:inspect PLUGIN...`

displays installation properties of a plugin

```text
displays installation properties of a plugin

USAGE
  $ hydra-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] plugin to inspect

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

EXAMPLE
  $ hydra-cli plugins:inspect myplugin
```

_See code:_ [_@oclif/plugin-plugins_](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/inspect.ts)

## `hydra-cli plugins:install PLUGIN...`

installs a plugin into the CLI

```text
installs a plugin into the CLI
Can be installed from npm or a git url.

Installation of a user-installed plugin will override a core plugin.

e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in the CLI without the need to patch and update the whole CLI.


USAGE
  $ hydra-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ hydra-cli plugins:add

EXAMPLES
  $ hydra-cli plugins:install myplugin 
  $ hydra-cli plugins:install https://github.com/someuser/someplugin
  $ hydra-cli plugins:install someuser/someplugin
```

_See code:_ [_@oclif/plugin-plugins_](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/install.ts)

## `hydra-cli plugins:link PLUGIN`

links a plugin into the CLI for development

```text
links a plugin into the CLI for development
Installation of a linked plugin will override a user-installed or core plugin.

e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' command will override the user-installed or core plugin implementation. This is useful for development work.


USAGE
  $ hydra-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ hydra-cli plugins:link myplugin
```

_See code:_ [_@oclif/plugin-plugins_](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/link.ts)

## `hydra-cli plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```text
removes a plugin from the CLI

USAGE
  $ hydra-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ hydra-cli plugins:unlink
  $ hydra-cli plugins:remove
```

_See code:_ [_@oclif/plugin-plugins_](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/uninstall.ts)

## `hydra-cli plugins:update`

update installed plugins

```text
update installed plugins

USAGE
  $ hydra-cli plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code:_ [_@oclif/plugin-plugins_](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/update.ts)

## `hydra-cli preview`

Preview GraphQL API schema

```text
Preview GraphQL API schema

USAGE
  $ hydra-cli preview

OPTIONS
  -s, --schema=schema  [default: ../../schema.graphql] Schema path
```

## `hydra-cli scaffold`

Starter kit: generates a directory layout and a sample schema file

```text
Starter kit: generates a directory layout and a sample schema file

USAGE
  $ hydra-cli scaffold

OPTIONS
  -a, --appPort=appPort          [default: 4000] GraphQL server port
  -b, --blockHeight=blockHeight  [default: 0] Start block height
  -d, --dir=dir                  [default: /home/runner/work/hydra/hydra/packages/hydra-cli] Project folder
  -h, --dbHost=dbHost            [default: localhost] Database host
  -i, --indexerUrl=indexerUrl    Hydra Indexer endpoint
  -m, --[no-]mappings            Create schema and mappings
  -n, --name=name                [default: hydra-scaffold] Project name
  -p, --dbPort=dbPort            [default: 5432] Database port
  -u, --dbUser=dbUser            [default: postgres] Database user
  -x, --dbPassword=dbPassword    [default: postgres] Database user password
  --rewrite                      Clear the folder before scaffolding
  --silent                       If present, the scaffolder is non-interactive and uses only provided CLI flags
```


---
description: Reference page of the Squid CLI tools
---

# Squid CLI

## Installation

The Squid CLI is a tool that helps develop and manage your Squid project. It provides multiple utilities, from database management to SaaS control, to code generation.

{% hint style="info" %}
Note: in the context of this guide, we assume the [Development Environment has been already set up](../tutorial/development-environment-set-up.md) and that `npm` is used, although other options are available.
{% endhint %}

To install Squid CLI, simply run this in a console.

```
npm install -g @subsquid/cli
```

{% hint style="info" %}
Bear in mind that `-g` option will install it globally.

Alternatively, you can remove the option if you prefer not to, and run the cli with `npx`
{% endhint %}

Once installed, check available commands by running

```
sqd --help
```

Which will print out a help. You can obtain help for individual commands in the same way, by specifying it after `sqd` and before the `--help` option. For example, for the `db` command:

```
sqd db --help
```

## Command overview

| Command   | Description                                         |
| --------- | --------------------------------------------------- |
| `auth`    | Authenticate for saas management                    |
| `codegen` | Analyze graphql schema and generate ORM model files |
| `help`    | Display help for sqd.                               |
| `db`      | Database management commands                        |
| `squid`   | Squid management commands (SaaS)                    |

### Options for `auth` command

| Argument         | Description                                            | Required |
| ---------------- | ------------------------------------------------------ | -------- |
| `-k` or `--key=` | A deployment key has to be provided after the argument | Yes      |

### Subcommands for `db` command

| Subcommand         | Description                                                              | Arguments                              |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------- |
| `create`           | Create database                                                          |                                        |
| `create-migration` | Analyze database state and generate migration to match the target schema | `[NAME]` migration filename (optional) |
| `drop`             | Drop the database                                                        |                                        |
| `migrate`          | Apply database migrations                                                |                                        |
| `new-migration`    | Create template file for a new migration                                 | `[NAME]` migration filename (optional) |
| `revert`           | Revert the last performed migration                                      |                                        |

### Subcommands for `squid` command

| Subcommand | Description                     | Arguments                                                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`   | Create a squid                  | <p><code>[NAME]</code> squid name (optional)<br><br><code>-d</code>, <code>--description=</code> description<br><br><code>-l</code>, <code>--logo=</code> logo url <br><br><code>-w</code>, <code>--website=</code> website url</p>                                                                           |
| `kill`     | Kill a squid or a squid version | `[NAMEANDVERSION]` squid `name` or `name@version`                                                                                                                                                                                                                                                             |
| `ls`       | Squid or versions list          | <p><code>-n</code>, <code>--name=</code> squid name<br><br><code>-t</code>, <code>--truncate</code> truncate data in columns (false by default)</p>                                                                                                                                                           |
| `release`  | Create a version                | <p><code>[NAMEANDVERSION]</code> squid <code>name</code> and version <code>name@version</code><br><code></code><br><code>-d</code>, <code>--description=</code> description<br> <br><code>-s</code>, <code>--source=</code> git URL of the source code</p>                                                    |
| `tail`     | Getting logs about version      | <p><code>[NAMEANDVERSION]</code> squid name and version<code>name@version</code><br><code></code><br><code></code><code>-f</code>, <code>--follow</code> continue streaming new logs<br><br><code>-l</code>, <code>--lines=</code> [default: 50] output a specific number of lines (if "follow" is false)</p> |
| `update`   | Update a version image          | <p><code>[NAMEANDVERSION]</code> squid name and version<code>name@version</code><br><br><code>-r</code>, <code>--hardReset</code> perform a hard reset (db wipeout) <br><br><code>-s</code>, <code>--source=</code> git URL of the source code</p>                                                            |

Examples of usage of this CLI can be seen in the [Tutorial on how to use our SaaS to deploy a hosted Squid](../tutorial/deploy-your-squid.md) or in the tutorial on how to customize the [Squid template](../tutorial/create-a-simple-squid.md).

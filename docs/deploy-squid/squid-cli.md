---
sidebar_position: 20
title: Squid CLI
---

# Squid CLI

The `squid` topic of the `sqd` command line interface is used to manage the deployment of your projects to [Aquarium](https://app.subsquid.io), a cloud service for running squids. 


## Subcommands for `squid` command

Inspect the available options with

```bash
sqd squid --help
```

It allows to

* create a new squid
* list deployed squids and versions
* deploy new versions for a squid
* update existing squids or squid versions
* kill a deployed squid
* monitor the logs of a squid

| Subcommand | Description                     | Arguments                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `create`   | Create a squid                  | <p><code>[NAME]</code> squid name<br/><br/><code>-d</code>, <code>--description</code> description<br/><br/><code>-l</code>, <code>--logo</code> logo URL <br/><br/><code>-w</code>, <code>--website</code> website URL</p>
| `kill`     | Kill a squid or a squid version | `[NAMEANDVERSION]` squid name and version formatted as `name@version`. If only name is provided, all the squid versions are deleted.                                                                                                                                                                                                                                                                 |
| `ls`       | List all squids or show details for a specific squid         | <p><code>-n</code>, <code>--name=</code> squid name (optional)<br/><br/><code>-t</code>, <code>--truncate</code> truncate data in columns (false by default)</p>                                                                                                                                                             |
| `release`  | Deploy a squid version                | <p><code>[NAMEANDVERSION]</code> squid <code>name</code> and version, formatted as <code>name@version</code><br/><code></code><br/><code>-d</code>, <code>--description=</code> description<br/> <br/><code>-s</code>, <code>--source=</code> git URL of the source code<br/> <br/><code>-e</code> (allows multiple) a set of environment variable to be set for the squid processor<br/><br/><code>--envFile</code> local file with environment variables</p>|
| `logs`     | Get squid logs      | <p><code>[NAMEANDVERSION]</code> squid name and version formatted as <code>name@version</code><br/><br/><code>-c</code>, <code>--container</code> output logs only from a specific squid component (processor\|query-node\|db-migrate)<br/><br/><code>-f</code>, <code>--follow</code> continue streaming new logs<br/><br/><code>-l</code>, <code>--level</code> set logs level (error\|debug\|info\|warning)<br/><br/><code>-p</code>, <code>--pageSize</code> set logs page size (default: 50)<br/><br/><code>--since</code> logs start date (default: 1d)</p> |
| `update`   | Redeploy a squid version          | <p><code>[NAMEANDVERSION]</code> squid name and version formatted as <code>name@version</code><br/><br/><code>-r</code>, <code>--hardReset</code> perform a hard reset (db wipe out) <br/><br/><code>-s</code>, <code>--source=</code> git URL of the source code<br/><br/><code>-e</code> (allows multiple) a set of environment variables to be set for the squid processor<br/><br/><code>--envFile</code> local file with environment variables</p> |                                                           |
| `prod`   | Promote a squid version to the production endpoint      | <p><code>[NAMEANDVERSION]</code> squid name and version formatted as <code>name@version</code></p>   

## Secrets

| Command                     | Description                  | Arguments                   |
|-----------------------------|------------------------------|-----------------------------|
|`secrets:ls`                 | List all secrets             |                             |
|`secrets:rm [NAME]`          | Delete a secret              | secret name                 |
|`secrets:set [NAME] [VALUE]` | Create or update a secret    | secret name, secret value   |


## Examples

### Create a new squid

```bash
sqd squid create squid-test
```

### Kill a squid :sob: (and all its versions)

```bash
sqd squid kill squid-test
```

### List squids 

```bash
 sqd squid ls
```

### List versions of a squid

```bash
npx sqd squid ls -n squid-test
```

### Release the kraken!

```bash
sqd squid:release squid-test@1 --source=git@github.com:subsquid/squid-template.git
```

### Show logs of a squid

```bash
sqd squid logs squid-test@1 -f
```

### Promote a version to production

```bash
sqd squid:prod squid-test@1
```

### Update a version with new code

```bash
npx sqd squid release squid-test@1 -r -s git@github.com:subsquid/squid-template.git
```

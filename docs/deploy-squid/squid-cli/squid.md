# squid

The `squid` topic of the `sqd` command line interface is used to manage the deployment of your projects to [Aquarium](https://app.subsquid.io), a cloud service for running squids. 

Inspect the avaialble options with

```
npx sqd squid --help
```

It allows to

* create a new squid
* list deployed squids and versions
* deploy new versions for a squid
* update existing squids or squid versions
* kill a deployed squid
* monitor the logs of a squid

## Subcommands for `squid` command

| Subcommand | Description                     | Arguments                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `create`   | Create a squid                  | <p><code>[NAME]</code> squid name (optional)<br/><br/><code>-d</code>, <code>--description</code> description<br/><br/><code>-l</code>, <code>--logo</code> logo url <br/><br/><code>-w</code>, <code>--website</code> website url</p>                                                                         |
| `kill`     | Kill a squid or a squid version | `[NAMEANDVERSION]` squid `name` or `name@version`                                                                                                                                                                                                                                                                 |
| `ls`       | Squid or versions list          | <p><code>-n</code>, <code>--name=</code> squid name<br/><br/><code>-t</code>, <code>--truncate</code> truncate data in columns (false by default)</p>                                                                                                                                                             |
| `release`  | Create a version                | <p><code>[NAMEANDVERSION]</code> squid <code>name</code> and version <code>name@version</code><br/><code></code><br/><code>-d</code>, <code>--description=</code> description<br/> <br/><code>-s</code>, <code>--source=</code> git URL of the source code</p>|
| `logs`     | Getting logs about version      | <p><code>[NAMEANDVERSION]</code> squid name and version <code>name@version</code><br/><br/><code>-c</code>, <code>--container</code> output logs only from a specific squid component (processor\|query-node\|db-migrate)<br/><br/><code>-f</code>, <code>--follow</code> continue streaming new logs<br/><br/><code>-l</code>, <code>--level</code> set logs level (error\|debug\|info\|warning)<br/><br/><code>-p</code>, <code>--pageSize</code> set logs page size (default: 50)<br/><br/><code>--since</code> logs start date (default: 1d)</p> |

| `update`   | Update a version image          | <p><code>[NAMEANDVERSION]</code> squid name and version<code>name@version</code><br/><br/><code>-r</code>, <code>--hardReset</code> perform a hard reset (db wipeout) <br/><br/><code>-s</code>, <code>--source=</code> git URL of the source code</p>                                                            |

## Examples

#### Create a new squid

```
sqd squid create squid-test
```

#### Kill a squid :sob: (and all its versions)

```
sqd squid kill squid-test
```

#### List squids 

```
sqd squid ls
```

#### List versions of a squid

```
sqd squid ls -n squid-test
```

#### Release (the kraken! :squid:)

```
sqd squid release squid-test@1 --source=git@github.com:subsquid/squid-template.git
```

#### Show logs of a squid

```
sqd squid logs squid-test@1 -f
```

#### Update a version with new code

```
sqd squid release squid-test@1 -r -s git@github.com:subsquid/squid-template.git
```

Some examples of how to use this command can be seen in the [Deploy a Squid Tutorial](/docs/tutorials/deploy-your-squid).

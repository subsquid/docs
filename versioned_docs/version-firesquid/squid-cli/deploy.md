`sqd deploy`
============

Deploy or update a squid version

Squid name and version are taken from the provided deployment manifest.

* [`sqd deploy SOURCE`](#sqd-deploy-source)

When invoked by an account with more than one organization, this command may require specifying an [organization](/deploy-squid/organizations) with the `-o/--org` flag. The organization has to be specified when deploying a new squid, but can be omitted when deploying a new version of an existing squid.

Aquarium users with just one organization can omit this flag.

## `sqd deploy SOURCE`

Deploy a new or update an existing squid version

```
USAGE
  $ sqd deploy [SOURCE] [-m <value>] [-u] [-r] [--no-stream-logs] [-o <value>]

ARGUMENTS
  SOURCE  Squid source. Could be:
          - a relative or absolute path to a local folder (e.g. ".")
          - a URL to a .tar.gz archive
          - a github URL to a git repo with a branch or commit tag

FLAGS
  -m, --manifest=<value>  [default: squid.yaml] Relative path to a squid manifest file in squid source
  -o, --org=<value>       Organization
  -r, --hard-reset        Do a hard reset before deploying. Drops and re-creates all the squid resources including the database. Will cause a short API downtime
  -u, --update            Do not require a confirmation if the version already exists
  --no-stream-logs        Do not attach and stream squid logs after the deploy

DESCRIPTION
  Deploy a new or update an existing squid version

ALIASES
  $ sqd squid deploy
```

_See code: [src/commands/deploy.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/deploy.ts)_

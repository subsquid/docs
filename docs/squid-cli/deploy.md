`sqd deploy`
============

Deploy a new or update the existing squid version. The squid name and the version is taken from the provided deployment manifest.

* [`sqd deploy SOURCE`](#sqd-deploy-source)

## `sqd deploy SOURCE`

Deploy a new or update the existing squid version.

```
USAGE
  $ sqd deploy [SOURCE] [-m <value>] [-u] [-r] [--no-stream-logs]

ARGUMENTS
  SOURCE  Squid source. Could be:
          - a relative or absolute path to a local folder (e.g. ".")
          - a URL to a .tar.gz archive
          - a github URL to a git repo with a branch or commit tag

FLAGS
  -m, --manifest=<value>  [default: squid.yaml] Relative path to a squid manifest file in squid source
  -r, --hard-reset        Do a hard reset before deploying. Drops and re-creates all the squid resources including the database. Will cause a short API downtime
  -u, --update            Do not require a confirmation if the version already exists
  --no-stream-logs        Do not attach and stream squid logs after the deploy

DESCRIPTION
  Deploy a new or update an existing squid version

ALIASES
  $ sqd squid deploy
```

_See code: [src/commands/deploy.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/deploy.ts)_

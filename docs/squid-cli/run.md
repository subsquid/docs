`sqd run`
=========

Run a squid locally according to the [deployment manifest](/deploy-squid/deploy-manifest).

* [sqd run PATH](#sqd-run-path)

Notes:
 - The command is especially useful for running [multichain squids](/basics/multichain), as it runs all services in the same terminal and handles failures gracefully.
 - Environment variables are read from the deployment manifest; `.env` file is ignored. 
 - Unlike the common `commands.json` script `sqd process`, `sqd run` will neither build nor apply migrations automatically.
   ```bash
   sqd build
   sqd migration:apply
   sqd run .
   ```
   is a common sequence of commands when using `sqd run` in local development.

## `sqd run PATH`

Run a squid

```
USAGE
  $ sqd run [PATH] [-m <value>] [-f <value>] [-i <value> | -e <value>] [-r <value>]

FLAGS
  -e, --exclude=<value>...  Do not run specified services
  -f, --envFile=<value>     [default: .env] Relative path to an additional environment file in squid source
  -i, --include=<value>...  Run only specified services
  -m, --manifest=<value>    [default: squid.yaml] Relative path to a squid manifest file in squid source
  -r, --retries=<value>     [default: 5] Attepms to restart failed or stopped services

DESCRIPTION
  Run a squid
```

_See code: [src/commands/run.ts](https://github.com/subsquid/squid-cli/blob/master/src/commands/run.ts)_

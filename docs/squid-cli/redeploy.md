`sqd redeploy`
==============

Restart a squid version

* [`sqd redeploy NAMEANDVERSION`](#sqd-redeploy-nameandversion)

## `sqd redeploy NAMEANDVERSION`

Restart a squid version

```
USAGE
  $ sqd redeploy [NAMEANDVERSION] [-e <value>] [--envFile <value>]

ARGUMENTS
  NAMEANDVERSION  name@version

FLAGS
  -e, --env=<value>...  environment variable
  --envFile=<value>     file with environment variables

DESCRIPTION
  Restart a squid version

ALIASES
  $ sqd squid redeploy
```

_See code: [src/commands/redeploy.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/redeploy.ts)_

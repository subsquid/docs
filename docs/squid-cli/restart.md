`sqd restart`
=============

Restart a squid version

* [`sqd restart NAMEANDVERSION`](#sqd-restart-nameandversion)

## `sqd restart NAMEANDVERSION`

Restart a squid version

```
USAGE
  $ sqd restart [NAMEANDVERSION] [--no-stream-logs]

ARGUMENTS
  NAMEANDVERSION  name@version

FLAGS
  --no-stream-logs  Do not attach and stream squid logs after the deploy

ALIASES
  $ sqd squid redeploy
  $ sqd redeploy
```

_See code: [src/commands/restart.ts](https://github.com/subsquid/squid-cli/blob/master/src/commands/restart.ts)_

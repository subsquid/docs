`sqd logs`
==========

Fetch squid logs

* [`sqd logs NAME`](#sqd-logs-name)

## `sqd logs NAME`

Fetch squid logs

```
USAGE
  $ sqd logs NAME

ARGUMENTS
  NAME  name@version

OPTIONS
  -c, --container=processor|api|db-migrate|db
  -f, --follow
  -l, --level=error|debug|info|warning
  -p, --pageSize=pageSize                                 [default: 100]
  --since=since                                           [default: 1d]

ALIASES
  $ sqd squid:logs
```

_See code: [src/commands/logs.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/logs.ts)_

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

FLAGS
  -c, --container=<option>...  Container name
                               <options: processor|query-node|api|db-migrate|db>
  -f, --follow                 Follow
  -l, --level=<option>...      Log level
                               <options: error|debug|info|warning>
  -o, --org=<value>            Organization
  -p, --pageSize=<value>       [default: 100] Logs page size
  -s, --search=<value>         Filter by content
      --since=<value>          [default: 1d] Filter by date/interval

DESCRIPTION
  Fetch logs from a squid deployed to the Cloud

ALIASES
  $ sqd squid logs
```

_See code: [src/commands/logs.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/logs.ts)_

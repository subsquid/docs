`sqd logs`
==========

Fetch logs from a squid deployed to the Cloud

* [`sqd logs`](#sqd-logs-1)

## `sqd logs`

Fetch logs from a squid deployed to the Cloud

```
USAGE
  $ sqd logs [--interactive] [--since <value>] [--search <value>] [-f | -p <value>]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | [-s <slot> -n <name>] | [-t <tag> ]]
    [-c processor|query-node|api|db-migrate|db...]
    [-l error|debug|info|warning...] [--since <value>]

FLAGS
  -c, --container=<option>...  Container name
                               <options: processor|query-node|api|db-migrate|db>
  -f, --follow                 Follow
  -l, --level=<option>...      Log level
                               <options: error|debug|info|warning>
  -p, --pageSize=<value>       [default: 100] Logs page size
      --[no-]interactive       Disable interactive mode
      --search=<value>         Filter by content
      --since=<value>          [default: 1d] Filter by date/interval

SQUID FLAGS
  -n, --name=<name>                               Name of the squid
  -r, --reference=[<org>/]<name>(@<slot>|:<tag>)  Fully qualified reference of the squid.
                                                  It can include the organization, name,
                                                  slot, or tag
  -s, --slot=<slot>                               Slot of the squid
  -t, --tag=<tag>                                 Tag of the squid

ORG FLAGS
  -o, --org=<code>  Code of the organization
```

Notes:
 * `--since` accepts the notation of the [`ms` library](https://www.npmjs.com/package/ms): 1d, 10h, 1m.
 * With `--level=error` `sqd` will fetch logs emitted by three different calls to the [SDK Logger](/sdk/reference/logger), namely
   - `ctx.log.error`
   - `ctx.log.fatal`
   - `ctx.log.trace`

_See code: [src/commands/logs.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/logs.ts)_

`sqd gateways`
==============

Explore data sources for a squid

* [`sqd gateways list`](#sqd-gateways-list)

## `sqd gateways list`

List available gateways

```
USAGE
  $ sqd gateways list [--interactive] [-t <evm|substrate>] [-n <regex>] [-c <number>]

FLAGS
  -c, --chain=<number>        Filter by chain ID or SS58 prefix
  -n, --name=<regex>          Filter by network name
  -t, --type=<evm|substrate>  Filter by network type
      --[no-]interactive      Disable interactive mode

ALIASES
  $ sqd gateways ls
```

_See code: [src/commands/gateways/ls.ts](https://github.com/subsquid/squid-cli/blob/master/src/commands/gateways/ls.ts)_

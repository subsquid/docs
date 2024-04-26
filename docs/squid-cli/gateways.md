`sqd gateways`
==============

Explore data sources for a squid

* [`sqd gateways ls`](#sqd-gateways-ls)

## `sqd gateways ls`

Explore data sources for a squid

```
List available gateways

USAGE
  $ sqd gateways ls [-t evm|substrate] [-n <value>] [-c <value>]

FLAGS
  -c, --chain=<number>        Filter by chain ID or SS58 prefix
  -n, --name=<regex>          Filter by network name
  -t, --type=<evm|substrate>  Filter by network type

DESCRIPTION
  List available gateways
```

_See code: [src/commands/gateways/ls.ts](https://github.com/subsquid/squid-cli/blob/master/src/commands/gateways/ls.ts)_

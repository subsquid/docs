`sqd gateways`
==============

Explore data sources for a squid

* [`sqd gateways ls`](#sqd-gateways-ls)

## `sqd gateways ls`

Explore data sources for a squid

```
List available gateways

USAGE
  $ sqd gateways ls [-t evm|substrate] [-s <value>]

FLAGS
  -s, --search=<value>        Search gateways
  -t, --type=<evm|substrate>  Filter gateways by network type

DESCRIPTION
  List available gateways
```

_See code: [src/commands/gateways/ls.ts](https://github.com/subsquid/squid-cli/blob/master/src/commands/gateways/ls.ts)_

`sqd list`
========

List squids deployed to the Cloud

* [`sqd list`](#sqd-list-1)

## `sqd list`

List squids deployed to the Cloud

```
USAGE
  $ sqd list [--interactive] [--truncate]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | -n <name> | [-s <slot>] | [-t <tag>]]

FLAGS
  --[no-]interactive  Disable interactive mode
  --[no-]truncate     Truncate data in columns: false by default

SQUID FLAGS
  -n, --name=<name>                               Name of the squid
  -r, --reference=[<org>/]<name>(@<slot>|:<tag>)  Fully qualified reference
                                                  of the squid. It can include
                                                  the organization, name, slot,
                                                  or tag
  -s, --slot=<slot>                               Slot of the squid
  -t, --tag=<tag>                                 Tag of the squid

ORG FLAGS
  -o, --org=<code>  Code of the organization

ALIASES
  $ sqd ls
```

_See code: [src/commands/ls.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/ls.ts)_

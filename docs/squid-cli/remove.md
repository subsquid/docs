`sqd remove`
============

Remove a squid deployed to the Cloud

* [`sqd remove`](#sqd-remove-1)

## `sqd remove`

Remove a squid deployed to the Cloud

```
USAGE
  $ sqd remove [--interactive] [-f]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | [-s <slot> -n <name>] | [-t <tag> ]]

FLAGS
  -f, --force             Does not prompt before removing a squid or its version
      --[no-]interactive  Disable interactive mode

SQUID FLAGS
  -n, --name=<name>                               Name of the squid
  -r, --reference=[<org>/]<name>(@<slot>|:<tag>)  Fully qualified reference of the squid. It can include the organization, name, slot, or tag
  -s, --slot=<slot>                               Slot of the squid
  -t, --tag=<tag>                                 Tag of the squid

ORG FLAGS
  -o, --org=<code>  Code of the organization

ALIASES
  $ sqd rm
```

_See code: [src/commands/rm.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/rm.ts)_

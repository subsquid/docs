`sqd restart`
=============

Restart a squid deployed to the Cloud

* [`sqd restart`](#sqd-restart-1)

## `sqd restart`

Restart a squid deployed to the Cloud

```
USAGE
  $ sqd restart [--interactive]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | [-s <slot> -n <name>] | [-t <tag> ]]

FLAGS
  --[no-]interactive  Disable interactive mode

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

_See code: [src/commands/restart.ts](https://github.com/subsquid/squid-cli/blob/master/src/commands/restart.ts)_

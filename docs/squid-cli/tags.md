`sqd tags`
=============

Manage squid deployements' tags. See the [slots and tags guide](/cloud/resources/slots-and-tags).

* [`sqd tags add`](#sqd-tags-add)
* [`sqd tags remove`](#sqd-tags-remove)

## `sqd tags add`

Add a tag to a squid deployment / slot

```
USAGE
  $ sqd tags add TAG [--interactive] [--allow-tag-reassign]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | [-s <slot> -n <name>] | [-t <tag> ]]

ARGUMENTS
  TAG  New tag to assign

FLAGS
  --allow-tag-reassign  Allow reassigning an existing tag
  --[no-]interactive    Disable interactive mode

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

_See code: [src/commands/tags/add.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/tags/add.ts)_

## `sqd tags remove`

Remove a tag from a squid deployment / slot

```
USAGE
  $ sqd tags remove TAG [--interactive]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | [-s <slot> -n <name>] | [-t <tag> ]]

ARGUMENTS
  TAG  New tag to assign

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

_See code: [src/commands/tags/remove.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/tags/remove.ts)_

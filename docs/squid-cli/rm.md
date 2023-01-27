`sqd rm`
========

Remove a squid or a squid version

* [`sqd rm NAMEANDVERSION`](#sqd-rm-nameandversion)

## `sqd rm NAMEANDVERSION`

Remove a squid or a squid version

```
USAGE
  $ sqd rm [NAMEANDVERSION] [-f]

ARGUMENTS
  NAMEANDVERSION  <name> or <name@version>

FLAGS
  -f, --force  Does not prompt before removing a squid or its version

DESCRIPTION
  Remove a squid or a squid version

ALIASES
  $ sqd squid kill
  $ sqd kill
```

_See code: [src/commands/rm.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/rm.ts)_

`sqd ls`
========

List squids and squid versions

* [`sqd ls`](#sqd-ls)

The command requires specifying an [organization](/deploy-squid/organizations) with the `-o/--org` flag when invoked by accounts with more than one organization. Aquarium users with just one organization can omit this flag.

## `sqd ls`

List squids and squid versions

```
USAGE
  $ sqd ls [-n <value>] [-t] [-o <value>]

FLAGS
  -n, --name=<value>  squid name
  -o, --org=<value>   Organization
  -t, --truncate      truncate data in columns: false by default

DESCRIPTION
  List squids and squid versions

ALIASES
  $ sqd squid ls
```

_See code: [src/commands/ls.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/ls.ts)_

`sqd secrets`
=============

Manage account secrets

The secrets are [exposed as a context](/cloud/resources/env-variables/#secrets), and are accessible to all the squids deployed by the current SQD Cloud [organization](/cloud/resources/organizations).

* [`sqd secrets list`](#sqd-secrets-list)
* [`sqd secrets remove NAME`](#sqd-secrets-remove-name)
* [`sqd secrets set NAME VALUE`](#sqd-secrets-set-name-value)

## `sqd secrets list`

List organization secrets in the Cloud

```
USAGE
  $ sqd secrets list [--interactive] [-o <value>]

FLAGS
  -o, --org=<value>       Organization
      --[no-]interactive  Disable interactive mode

ALIASES
  $ sqd secrets ls
```

_See code: [src/commands/secrets/ls.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/secrets/ls.ts)_

## `sqd secrets remove NAME`

Delete an organization secret in the Cloud

```
USAGE
  $ sqd secrets remove NAME [--interactive] [-o <value>]

ARGUMENTS
  NAME  The secret name

FLAGS
  -o, --org=<value>       Organization
      --[no-]interactive  Disable interactive mode

ALIASES
  $ sqd secrets rm
```

_See code: [src/commands/secrets/rm.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/secrets/rm.ts)_

## `sqd secrets set NAME VALUE`

Add or update an organization secret in the Cloud. If value is not specified, it is read from standard input. The secret will be exposed as an environment variable with the given name to all the squids in the organization. NOTE: The changes take affect only after a squid is restarted or updated.

```
USAGE
  $ sqd secrets set NAME VALUE [--interactive] [-o <value>]

ARGUMENTS
  NAME   The secret name
  VALUE  The secret value

FLAGS
  -o, --org=<value>       Organization
      --[no-]interactive  Disable interactive mode
```

_See code: [src/commands/secrets/set.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/secrets/set.ts)_

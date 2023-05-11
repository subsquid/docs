`sqd secrets`
=============

Manage account secrets

The secrets are exposed as environment variables, and are accessible to all the squids deployed by the current Aquarium account.

* [`sqd secrets:ls`](#sqd-secretsls)
* [`sqd secrets:rm NAME`](#sqd-secretsrm-name)
* [`sqd secrets:set NAME VALUE`](#sqd-secretsset-name-value)

## `sqd secrets:ls`

List all secrets for the current Aquarium account

```
USAGE
  $ sqd secrets:ls
```

_See code: [src/commands/secrets/ls.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/secrets/ls.ts)_

## `sqd secrets:rm NAME`

Remove a secret

```
USAGE
  $ sqd secrets:rm NAME

ARGUMENTS
  NAME  The secret name
```

_See code: [src/commands/secrets/rm.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/secrets/rm.ts)_

## `sqd secrets:set NAME VALUE`

Create or update a secret. The secret will be exposed as an environment variable with the given name to all the squids. Note the changes take affect only after a squid is restarted or updated.

```
USAGE
  $ sqd secrets:set NAME VALUE

ARGUMENTS
  NAME   The secret name
  VALUE  The secret value
```

_See code: [src/commands/secrets/set.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/secrets/set.ts)_

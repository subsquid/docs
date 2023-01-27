`sqd init`
==========

Create a squid from a template

* [`sqd init NAME`](#sqd-init-name)

## `sqd init NAME`

Create a squid from a template

```
USAGE
  $ sqd init [NAME] [-t <value>] [-d <value>] [-r]

ARGUMENTS
  NAME  The squid name. It must contain only alphanumeric or dash ("-") symbols and must not start with "-".
        Squid names are globally unique.

FLAGS
  -d, --dir=<value>
      The target location for the squid. If omitted, a new folder NAME is created.

  -r, --remove
      Clean up the target directory if it exists

  -t, --template=<value>
      A template for the squid. Accepts:
      - a github repository URL containing a valid squid.yaml manifest in the root folder
      or one of the pre-defined aliases:
      - evm  A minimal squid template for indexing EVM data.
      - abi  A template to auto-generate a squid indexing events and txs from a contract ABI
      - gravatar  A sample EVM squid indexing the Gravatar smart contract on Ethereum.
      - substrate  A template squid for indexing Substrate-based chains.
      - frontier-evm  A template for indexing Frontier EVM chains, like Moonbeam and Astar.
      - ink  A template for indexing Ink! smart contracts
      - acala  A template for indexing Acala EVM+ smart contracts
```

_See code: [src/commands/init.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/init.ts)_

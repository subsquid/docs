`sqd init`
==========

Setup a new squid project from a template or github repo

* [`sqd init NAME`](#sqd-init-name)

## `sqd init NAME`

Setup a new squid project from a template or github repo

```
USAGE
  $ sqd init NAME [--interactive] [-t <value>] [-d <value>] [-r]

ARGUMENTS
  NAME  The squid name. It must contain only alphanumeric or dash ("-") symbols and must not start with "-".

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
      - multichain  A template for indexing data from multiple chains
      - gravatar  A sample EVM squid indexing the Gravatar smart contract on Ethereum.
      - substrate  A template squid for indexing Substrate-based chains.
      - ink  A template for indexing Ink! smart contracts
      - ink-abi  A template to auto-generate a squid from an ink! contract ABI
      - frontier-evm  A template for indexing Frontier EVM chains, like Moonbeam and Astar.

  --[no-]interactive
      Disable interactive mode
```

_See code: [src/commands/init.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/init.ts)_

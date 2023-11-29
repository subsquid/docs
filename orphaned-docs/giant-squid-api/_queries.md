# Queries

:::warning
The Giant Squid API is currently under active development and this part of the documentation is largely outdated. Reach out at [SquidDevs chat](https://t.me/HydraDevs) to get support on the Giant Squid API.
:::

## Examples

Each chain is represented as its own type and has to be queried separately, for example, the following query:

```graphql
query AstarLatestTransfers {
  astar {
    transfers(limit: 10, orderBy: blockNumber_DESC, where: {success_eq: true}) {
      fromId
      toId
      amount
      timestamp
      success
    }
    
    transfersConnection(orderBy: id_ASC, where: {success_eq: true}) {
      totalCount
    }
  }
}

```

Is going to obtain the latest 10 successful transfers, as well as the total number of successful transactions for the **Astar** blockchain.

In order to do the same for, say, Kusama, we'd need to change `astar` with `kusama` at line number 2. If, instead, we wanted to obtain data for both chains, this query would yield such result:

```graphql
query AstarAndKusamaLatestTransfers {
  astar {
    transfers(limit: 10, orderBy: blockNumber_DESC, where: {success_eq: true}) {
      fromId
      toId
      amount
      timestamp
      success
    }
    
    transfersConnection(orderBy: id_ASC, where: {success_eq: true}) {
      totalCount
    }
  }
  kusama {
    transfers(limit: 10, orderBy: blockNumber_DESC, where: {success_eq: true}) {
      fromId
      toId
      amount
      timestamp
      success
    }
    
    transfersConnection(orderBy: id_ASC, where: {success_eq: true}) {
      totalCount
    }
  }
}

```

In order to profit from aggregated multi-chain information, a minimum processing is necessary on the client's side, as shown in this section.

:::danger
Note: It is **very** important to stick to good practices like using `limit` parameter to limit the number of results and using the `*Connection` types to paginate non-limited request.

This is to avoid large queries generating a time-out or clogging the system.
:::

## Account Addresses

It is important to mention, at this point, that each chain have their own address encoding. Let's take this query, which monitors Account's staking information on Polkadot,  as an example:

```graphql
query MyQuery {
  polkadot {
    accountById(id: "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM") {
      totalReward
      totalSlash
      rewards {
        amount
        era
        validator
        timestamp
      }
      slashes {
        amount
        era
        timestamp
      }
    }
  }
}
```

The same exact query can be used for `kusama`, or `astar` but the Address ID `13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM` needs to be correctly converted to the encoding specific to the chain in question.

Once again, address encoding and conversion have to be performed on the client's  side.

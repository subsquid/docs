---
sidebar_position: 20
title: Whitepaper
description: A fairly detailed design overview
---

## Intro 


The blockchain technology, initially designed solely for peer-to-peer transfers (Bitcoin), has evovled into a general 
purpose global execution runtime. Decentralized applications (dApps) powered by blockchains now span multiple verticals which include:

- Decentralized Finance (DeFi) and tokenized real-world assets (RWA)
- Decentralized Social application (DeSoc)
- Decentralized Gaming with peer-to-peer economy (GameFi)
- Decentralized physical infrastructure (DePIN)
- Decentralized creator ecomomy (Music, Videos, NFTs)

A key enabler for the ever-growing scale and complexity of dApps is the emergent infrastucture, all incorporated into the "Web3 stack":

- Scalable execution (L2 chains, Rollups, Bridges, Solana)
- Putting off-chain and real world data on-chain (e.g. Chainlink)
- Permanent and long-term storage for large data (Arweave, Filecoin)
- Application-specific databases and APIs (TheGraph, POKT, Kwil, WeaveDB)

![image](https://user-images.githubusercontent.com/8627422/279713390-8667b401-5213-4126-a0c2-55d39ba611e8.png)

However, an essential part of the stack is missing -- it is currently problematic to query and aggregate 
the exponentially growing amount of data produced by the blockchains themselves (transactions and state data), applications 
(decoded smart contract states) and the relevant off-chain data (prices, data kept in IPFS and Arweave, pruned EIP4844 data). In the traditional (Web2) world, the data produced by the application (e.g. logs or client data) are
stored into centralized data lakes (e.g. BigQuery, Snowflake, Apache Iceberg), from where it can be queried or batch-extracted. On the contrary, the true value of the Web3 app data is unlocked when multi-chain, multi-application data can be seamlessly extracted, filtered and aggregated.

However the permissionless and decentralized nature of Web3 requires a fundamentally different solution with the following properties:

- Infinite horizontal scalability: the capacity of the lake should grow indefinitely as new nodes join
- Permissionless data access: the data can be uploaded and queried without any gatekeeping or centralized control
- Credible neutrality: no barrier for new nodes to join
- Trust-minimized queries: the data can be audited and the clients can verify the query result
- Low maintainance cost: the price per query should be negligible  

The Subsquid Network is set to satisfy all the properties above, with the following design decisions:

- The raw data is uploaded into permanent storage by the data providers which act as oracles but for "big data"
- The data is compressed and distributed among the network nodes
- The node operators have to bond a secutity deposit which can be slashed for byzantine behavior 
- Each node efficiently queries the local data with DuckDB 
- Any query can be vefiried by submitting a signed response to an on-chain smart contract 

With the recent advances in the in-process databases like DuckDB and a ever-decreasing price of quality SSD storage, the operational costs of a single node handling 1Tb of data are as low as 35$/mo [1]. 

At the initial phase, the Subsquid Network only supports simple queries that can be resolved by quering the local data of a suitable node. It already provides a fundamentally new primitive for on-chain data availability, fully eliminating the need to maintain costly archival blockchain nodes for historical data access. 

After the bootstrapping, the network will be endowed with an additional query planning and execution layer supporting general purpose SQL queries, inspired by Apache Calcite and DataFusion.

## Design Overview

The Subsquid Network assumes the participation of the following actors:

- Data Providers
- Workers 
- Scheduler
- Logs Collector
- Rewards manager
- Data Consumers

![image](https://github.com/subsquid/subsquid-network-contracts/assets/8627422/beb1439d-aa15-42fa-8bc2-4fa89c7fc96d)


### Data Providers

Data Providers produce data to be served by Subsquid Network. Currently, the focus is on on-chain data, and the data providers are chains. Currently, only EVM- and Substrate-based chains are supported, while plans exist to support Cosmos chains and Solana.

Data providers are responsible for ensuring the quality of data and that the it is provided in a timely manner. During the bootstrap phase, Subsquid Labs GmbH acts as the sole data provider for the Subsquid Network, serving as a proxy for the chains from which the data is ingested block-by-block. The ingested data is validated by comparing the hashes, split into small compressed chunks and saved into persistent storage, from which the chunks are randomly distributed between the workers.

![image](https://user-images.githubusercontent.com/8627422/255241118-9ba68865-c088-42ac-a01b-f961d1ed564b.png)

The metadata is saved on-chain and is updated by the data provider each time a new piece of the data is uploaded. The metadata describes the schema, the data layout, the reserved storage and the desired replication factor to be accomodated by the network. The metadata structure is presented in an Appendix

The data provider is incentivized to provided consistent and valid data, and it is the data provider's responsibility to make the data available in the persistent storage. At the bootstrap phase, the persistent storage used by Subsquid Labs is an S3 compatible service with backups pinned to IPFS. As the network matures, more data providers and storage options will be supported, with the data providers vetted by on-chain governance and known identities. 

Data providers pay on-chain subscription fees to the network to make data available and to have it served by workers. These fees are are sent to the Subsquid Network treasury. 

### Scheduler

The scheduler is responsible for distributing the data chunks submitted by the data providers among the workers. The scheduler listens to updates of the data-sets, as well as updates for the worker sets and sends requests to the workers to download new chunks and/or redistribute the existing data chunks based on the capacity and the target redundancy for each dataset. Once a worker receives an update request from the coordinator, it downloads the missing data chunks from the corresponding persistent storage.

![image](https://user-images.githubusercontent.com/8627422/255990260-ee4eca18-faa0-4e14-a495-9aad99ef14cb.png)


### Workers

Workers contribute the storage and compute resources to the network, serve the data to peer-to-peer to consumersand are rewarded with $SQD tokens. Each worker has to be registered on-chain by bonding `100_000` SQD tokens which can be slashed if the worker provable violates the protocol rule. $SQD holders can also delegate to a specific worker to signal the reliability of the worker and get a cut of the reward. 

The rewards are distributed each epoch and depend on:
- Previous number of epochs the worker stayed online
- The amount of served data to the clients
- The number of delegated tokens
- Fairness
- Liveness during the epoch

The worker submit to the Validator ping information along with the signed logs of the executed query requests, thus committing to the results returned to the clients. 


### Logs collector

The Logs Collector sole responsibility is to collect the liveness pings and the query execution logs from the workers, batch them and save into public persistent storage. The logs are signed by the worker P2P identies and pinned into IPFS. The data is stored for at least 6 months and is used by the other actors. 

### Reward Manager

The Reward Manager is responsible for calculating and submitting worker rewards on-chain for each epoch. The rewards depend on:

- Worker liveness during the epoch
- Delegated tokens
- Served queries (in bytes; both scanned and returned size is accounted)
- Liveness since the registration

The Reward Manager accesses the logs, calculates the rewards and submits a claimable commitment on-chain for each epoch. Each worker then should claim the reward individually. The rewards may expire after some prolonged time.

### Data Consumers

In order to query the network, data consumers should operate a gateway or use an external service (which maybe public or require any form of payment). A gateway is bound to an on-chain address. The number of requests by a gateway can submit to the network is capped by a number calculated based on amount of locked $SQD tokens. Thus, the more tokens are locked by the gateway operator, the more bandwidth it is allowed to consume. 

One can think of this mechanism as if the locked SQD yield virtual "compute units" (CU) based on the period the tokens are locked. All queries cost the same price of 1 CU (until complex SQL queries are implemented). 

Thus, the query cap is calculated by:    
- Calculating the virtual yield in SQD on the locked tokens (in SQD)
- Multiplying by the current CU price (in CU/SQD)

### Boosters

The locking mechanism has an additional booster design to incentivize gateway operators locking the tokens for longer periods of time. The longer the lock period, the more CUs are allocated per SQD/yr. The APY is calculated as `BASE_VIRTUAL_APY * BOOSTER`. 

![image](https://github.com/subsquid/subsquid-network-contracts/assets/8627422/a1ab5ce1-da58-4cdc-aac5-90728be23b9e)

At the launch of the network the parameters are set to be `BASE_VIRTUAL_APY = 12%` and `1SQD = 4000 CU`. 

For example, if a gateway operator locks 100 SQD for 2 month, the virtual yield is 2SQD, which means it can perform 8000 queries (8000 CU).
If 100 SQD are locked for 3 years, the virtual yield is `12% * 3` APY, so the operator gets CUs worth 108 of SQD, that is it can submit up to `432000` queries to the network within the period of 3 years.

## Query Validation

The Subsquid Network provides economic guarantees for the validity of the queried data, with the opt-in to validate specific queries on-chain. All query responses are signed by the worker who has executed the query which acts as a commitment to the query response. Anyone can submit such a response on-chain, and, if is deemed incorrect, the worker bond is slashed. The smart contract validation logic may be dataset specific  depending on the nature of the data being queried, with the following options:

- Proof by Authority: a white-listed set of on-chain identities decide on the validity of the response. 
- Optimistic on-chain: after the validation request is submitted, anyone can submit a claim proving the query response is incorrect. For example, assume the original query was "Return transactions matching the filter `X` in the block range `[Y, Z]`" and the response is some set of transactions `T`. During the validation window, anyone can submit a Merkle proof for some transaction `t` matching the filter `X` yet not in `T`. If no such disproofs were submitted during the decision window, the response is deemed valid.
- Zero-Knowledge: a zero-knowledge proof that the response exactly matches the requests. The zero-knowledge proof is generated off-chain by a prover and is validated on-chain by the smart-contract.

Since submitting each query for on-chain validation on-chain is costly and not feasible, the clients opt-in into submitting the query responses into an off-chain queue, together with the metadata such as response latency. Then independent searches scan the queue and submit suspicious queries for on-chain validation. If the query is deemed invalid, the submitter gets a portion of the slashed bond as a rewards, thus incentivising searchers to efficiently scan the queue for malicious responses. 

![image](https://github.com/subsquid/subsquid-network-contracts/assets/8627422/8ae1eef9-95f3-4cc4-9b53-2dd8c02d9559)


## SQD Token

SQD is an ERC20 token that powers Subsquid Network. It has the following functionalities:

1) Payment: serving as a means of payment for the payment of the fees to the nodes (workers)
running the required data pipelines of the Subsquid Protocol and the other workers serving the
API requests.

2) Utility/work: (a) bonding to join the network and running a node as a worker for data pipelines
and serving API requests of the Subsquid Protocol requires staking of SQD tokens; and later
(b) the possibility to stake to access premium datasets and receive discounts on them.

3) Delegation: delegated staking for the benefit of the node operator (worker) or the workers of
the Subsquid Protocol against a share of the fees earned by such node or worker.

The governance of the Subsquid Protocol may be handed over in the future to a decentralized autonomous organization (Subsquid DAO) that then governs the further development of the Subsquid Protocol. Subsquid may determine the SQD tokens as means of voting for the Subsquid DAO.


## Appendix I -- Metadata

The metadata has the following structure:

```ts
interface DataSet {
  dataset_id: string
  // how many times the dataset should be replicated
  replication_factor: int 
  // a unique URL for permanent storage. Can be s3:// bucket
  permanent_storage: string
  // how much space should for a single replica. 
  // the total space required by a dataset is replication_factor * reserved_space
  reserved_space: int
  // dataset-specific additional metadata
  extra_meta?: string
  // dataset-specific state description 
  state?: string
  // reserved for future use, must be false
  premium: boolean
}
```

The on-chain state of the dataset should be updated by the data provider periodically, and the total space must not exceed `reserved_space`. The dataset can be in the following states:

```ts
enum DatasetState {
  // submitted by the data provider 
  SUBMITTED,
  // the data being distributed by the network
  IN_PREPARATION,
  // served by the network
  ACTIVE,
  // if the subscription fee
  // has not been provided for the duration of an epoch
  COOLDOWN,
  // if the dataset is no longer served by the network
  // and will be deleted
  DISABLED
}
```

The `Scheduler` changes the state to `IN_PREPARATION` and `ACTIVE` from `SUBMITTED`. The `COOLDOWN` and `DISABLED` states are activated automatically if the subscription payment is not provided. 

At the initial stage of network, the switch to disabling datasets is granted to Subsquid Labs GmbH, which is going to be replaced by auto-payments at a later stage. 

## Appendix II -- Rewards 

The network rewards are paid out to workers and delegators for each epoch. The Reward Manager submits an on-chain claim commitment, from which each participant can claim. 

The rewards are allocated from the rewards pool. Each epoch, the rewards pool unlocks `APY_D * S * EPOCH_LENGTH` in rewards, where `EPOCH_LENGTH` is the length of the epoch in days, `S` is the total (bonded + delegated) amount of staked `SQD` during the epoch and `APY_D` is the (variable) base reward rate calculated for the epoch. 

### Rewards pool

The `SQD` supply is fixed for the initial, and the rewards are distributed are from a pool, to which `10%` of the supply is allocated at TGE. The reward pool has a protective mechanism, called health factor, which halves the effective rewards rate if the reward pool supply drops below 6-month average reward. 

After the initial bootstrapping phase a governance should decide on the target inflation rate to replenish the rewards pool with freshly minted tokens based on the already distributed rewards and participation rate.

### Reward rate 

The reward rate depends on the two factors: how much the network is utilized and how much of the supply is staked. The network utilization rate is defined as 

```
u_rate = (target_capacity - actual_capacity)/target_capacity
```

The target capacity is calculated as 
```
target_capacity = sum([d.reserved_space * d.replication_factor]) 
```
where the sum is over the non-disabled datasets `d`. 

The actualy capacity is calculated as
```
actual_capacity = num_of_active_workers() * WORKER_CAPCITY * CHURN
```

The `WORKER_CAPACITY` is a fixed storage per worker, set to `1Tb`. `CHURN` is a discounting factor to account for the churn, set to `0.9`.

The target APR (365-day-based rate) is then calculated as:
```
rAPR = base_apr(u_rate) * D(stake_factor)
```
The `base_apr` is set to `20%` in the balances state and is increased up to `70%` to incentivize more workers to join if the target capacity exceeds the actual one (and decreased otherwise):

![image](https://user-images.githubusercontent.com/8627422/256611463-eca7ae21-e26a-47ce-b78d-c1c8d8383205.png)

The discount factor `D` lowers the final `APY` if more than `25%` of the supply is staked:
![image](https://user-images.githubusercontent.com/8627422/256610465-386a8cbc-a57d-4575-bbbc-23eff7b8452e.png)

### Worker reward rate

Each epoch, `rAPR` is calculated and the total of

```
R = rAPR/365 * total_staked * EPOCH_LENGTH
``` 

is unlocked from the rewards pool. 

The rewards are then distributed between the workers and delegators, and the leftovers are split between the burn and the treasury.  

For a single worker and stakers for this token, the maximal reward is `rAPR/365 * (bond + staked) * EPOCH_LENGTH`. It is split into the worker liveness reward and the worker traffic reward. 

Let `S[i]` be the stake for `i`-th worker and `T[i]` be the traffic units (defined below) processed by the worker. We define the relative weights as

```
s[i] = S[i]/sum(S[i])
t_scanned[i] = T_scanned[i]/sum(T_scanned[i])
t_e[i] = T_e[i]/sum(T_e[i])
t[i] = sqrt(t_scanned[i] * t_e[i])
```

In words, `s[i]` and `t[i]` correspond to the contribution of the `i`-th worker to the total stake and to total traffic, respectively. 

The traffic weight `t[i]` is a geometric average of the normalized scanned (`t_scanned[i]`)  and the egress (`t_e[i]`) traffic processed by the worker. It is calculated by aggregating the logs of the queries processed by the worker during the epoch, and for each processed query the worker reports the response size (egress) and the number of scanned data chunks.

The max potential yield for the epoch is given by `rAPR` discribed above:

```
r_max = rAPR/365 * EPOCH_LENGTH
```

The actuall yield `r[i]` for the `i`-th worker is discounted:

```
r[i] = r_max * D_liveness * D_traffic(t_i, s_i) * D_tenure
```

`D_traffic` is a Cobb-Douglas type discount factor defined as

```
D_traffic(t_i, s_i) = min( (t_i/s_i)^alpha, 1 )
```

with the elasticity parameter alpha set to `0.1`.

It has the following properties:

- Always in the interval `[0, 1]`
- Goes to zero as `t_i` goes to zero
- Neutral (i.e. close to 1) when `s_i ~ t_i` that is, the stake contribution fair (proportial to the traffic contribution)
- Excess traffic contributes only sub-linearly to the reward

`D_liveness` is a liveness factor calculated as the percentage of the time the worker is self-reported as online. A worker sends a ping message every 10 seconds, and if there no pings within a minute, the worker is deemed offline for this period of time. The liveness factor is the persentage of the time (with minute-based granularity) the network is live. We suggest a piecewise linear function with the following properties:

- It is `0` below a reasonably high threshold (set to `0.8`)
- Sharply increases to near `1` in the "intermediary" regime `0.8-0.9`
- The penalty around `1` is diminishing

![image](https://user-images.githubusercontent.com/8627422/257277215-5c902bb4-2a90-4847-8a1f-1cd88e46fb54.png)


Finally, `D_tenure` is a long-range liveness factor incentivizing consistent liveness across the epochs. The rationale is that

- The probability of a worker failure decreases with the time the worker is live, thus freshly spawned workers are rewarded less
- The discount for freshly spawned workers discourages the churn among workers and incentivizes longer-term commitments

![image](https://user-images.githubusercontent.com/8627422/257228987-7863df56-8ad3-447d-a095-dae18c1027b3.png)

### Distribution between the worker and delegators

The total claimable reward for the `i`-th worker and the stakers is calculates simply as `r[i] * s[i]`. Clearly, `s[i]` is the sum of the (fixed) bond `b[i]` and the (variable) delegated stake `d[i]`. Thus, the delegator rewards account for `r[i] * d[i]`.  This extra reward part is split between the worker and the delegators:

- The worker gets: `r[i] * b[i] + 0.5 * r[i] * s[i]`
- The delegators get `0.5 * r[i] * s[i]`, effectively attining `0.5 * r[i]` as the effectual reward rate.

The rationale for this split is:
- Make the worker accountable for `r[i]`
- Incentivize the worker to attarch stakers (the additional reward part)
- Incentivize the stakers to stake for a worker with high liveness (and, in general, high `r[i]`)

At an equilibrium, the stakers will get `10%` annual yield, while workers get anything in betweek `20-30%` depending on the staked funds. Note, that the maximal stake is limited by the bond size.


## References

[1] [SuperDAO Growth Trends report](https://superdao.notion.site/Web3-Growth-Trends-2023-Superdao-Report-1b51a98ad10644afba94c1d9df1e5f99)

[2] Based on the estimate that read-only RPC queries constitute roughly 90% of the RPC provider traffic

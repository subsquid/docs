# Batch processing

The latest Subsquid SDK release, code named Fire Squid brings in a new type of processor, specifically designed for batch ingestion, aptly named: `SubstrateBatchProcessor`.

The ubiquitous `SubstrateProcessor` is very convenient and intuitive to use, its execution of one database transaction per block is very natural and makes it easy to develop around it. Furthermore, this is a very familiar pattern for developers that have previously used other similar indexing middleware out there.

For these reasons it might be the  default choice for many applications.

It is important to note, however the restrictions imposed by the single database transaction per block. Because of this pattern, the `SubstrateProcessor` cannot achieve the the maximum performance possible, as I/O operation represent a major bottleneck.

## In a nutshell

The `SubstrateBatchProcessor` has been developed to allow the implementation of faster mapping processes, reducing the read and write operations, to and from database and chain nodes.

It does, however, come with some minor drawbacks, as the batch format of processing is less convenient to work with, since one has to keep in mind that there is only one database transaction per batch (not per block).

This means that errors in mapping will become evident on when committing the transaction, thus making it harder to debug.

## Example

When using the new `SubstrateBatchProcessor` in your project, many things stay the same, including models generation, type-safe wrappers for Substrate Entities, and database schema. All of the changes can be summed up by watching at an example of the `processor.ts` file:

{% code title="processor.ts" %}
```typescript
import * as ss58 from "@subsquid/ss58";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { Account, HistoricalBalance } from "./model";
import { BalancesTransferEvent } from "./types/events";

const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: "https://kusama.archive.subsquid.io/graphql",
  })
  .addEvent("Balances.Transfer", {
    data: { event: { args: true } },
  } as const);

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfers = getTransfers(ctx);

  const accountIds = new Set<string>();
  for (const transfer of transfers) {
    accountIds.add(transfer.from);
    accountIds.add(transfer.to);
  }

  const accounts = await ctx.store
    .findByIds(Account, Array.from(accountIds))
    .then((accts) => {
      return new Map(accts.map((a) => [a.id, a]));
    });

  const history: HistoricalBalance[] = [];

  for (const transfer of transfers) {
    const from = getAccount(accounts, transfer.from);
    const to = getAccount(accounts, transfer.to);

    from.balance -= transfer.amount;
    to.balance += transfer.amount;

    history.push(
      new HistoricalBalance({
        id: `${transfer.id}-from`,
        account: from,
        balance: from.balance,
        timestamp: transfer.timestamp,
      })
    );

    history.push(
      new HistoricalBalance({
        id: `${transfer.id}-to`,
        account: to,
        balance: to.balance,
        timestamp: transfer.timestamp,
      })
    );
  }

  await ctx.store.save(Array.from(accounts.values()));
  await ctx.store.save(history);
});

interface TransferEvent {
  id: string;
  from: string;
  to: string;
  amount: bigint;
  timestamp: bigint;
}

function getTransfers(ctx: Ctx): TransferEvent[] {
  const transfers: TransferEvent[] = [];
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Balances.Transfer") {
        const event = new BalancesTransferEvent(ctx, item.event);
        let rec: { from: Uint8Array; to: Uint8Array; amount: bigint };
        if (event.isV1020) {
          const [from, to, amount, fee] = event.asV1020;
          rec = { from, to, amount };
        } else if (event.isV1050) {
          const [from, to, amount] = event.asV1050;
          rec = { from, to, amount };
        } else {
          rec = event.asV9130;
        }
        transfers.push({
          id: item.event.id,
          from: ss58.codec("kusama").encode(rec.from),
          to: ss58.codec("kusama").encode(rec.to),
          amount: rec.amount,
          timestamp: BigInt(block.header.timestamp),
        });
      }
    }
  }
  return transfers;
}

function getAccount(map: Map<string, Account>, id: string): Account {
  let acc = map.get(id);
  if (acc == null) {
    acc = new Account();
    acc.id = id;
    acc.balance = 0n;
    map.set(id, acc);
  }
  return acc;
}

```
{% endcode %}

## Paradigm shift

The first thing worth noticing is that instead of the usual "publish/subscribe" mechanism, where the `SubstrateProcessor` triggers a handler function, every time a Block or the specified Event/Call is encountered, this time we only specify Events or Calls that are of interest, then our mapping function is triggered by the `.run()` function.

The specified Events or Calls are used to build a batch request to the Squid Archive and this is another performance optimization, as only blocks containing such entities will be returned. The available options are these:

* `addEvent` to specify a Substrate Event, the format is `<Pallet name>.<Event name>` (e.g. `"Balances.Transfer"`) and an optional argument to specify the block range of execution, through the `range` field.
* `addCall` to specify a Substrate Call, the format is `<Pallet name>.<call name>` (e.g. `"Balances.set_balance"`, because calls usually don't have capital letters) and an optional argument to specify the block range, through the `range` field.
* `addEvmLog` to specify an EVM Log event we are interested in. The function accepts a string, with the contract address and an optional object, which allows to specify a `filter` field, to isolate contract topics, and a `range` field which works
* `addContractsContractEmitted` very similarly to the previous point, this is used to track WASM contracts being emitted. Similarly to EVM logs, it accepts a contract address argument and an optional object to set block range.

It is also worth mentioning that the `getTransfers` auxiliary function, whose goal is to extract the Event information, is coded to work with a list of blocks, and as such, will generate a list of Transfer Events information, not just one single transfer Event.

Finally, the `mapper` function passed to `processor.run()`, leverages the ability of the `Store` interface to save arrays of models, not just one model at a time.

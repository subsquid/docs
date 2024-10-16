---
sidebar_class_name: hidden
---

`sqd explorer`
==========

:::danger
`sqd explorer` is disabled in `@subsquid/cli>=3.0.0`. If you've been using it, please let us know in the [SquidDevs Telegram channel](https://t.me/HydraDevs).
:::

Visual explorer of deployed squids

Left pane: List of deployed squids.
Right pane: details of the selected squid. Navigate by pressing the corresponding number (e.g. `1` for Summary).

1) Summary: endpoint URL, sync status, DB storage utilization

2) Logs

3) DB access details

This command requires specifying an [organization](/cloud/resources/organizations) with the `-o/--org` flag when invoked by accounts with more than one organization. SQD Cloud users with just one organization can omit this flag.

![Squid SDK](</img/sqd-explorer-snap.png>)

_See code: [src/commands/explorer.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/explorer.ts)_

`sqd explorer`
==========

Visual explorer of deployed squids

Left pane: List of deployed squids.
Right pane: details of the selected squid. Navigate by pressing the corresponding number (e.g. `1` for Summary).

1) Summary: endpoint URL, sync status, DB storage utilization

2) Logs

3) DB access details

This command requires specifying an [organization](/deploy-squid/organizations) with the `-o/--org` flag when invoked by accounts with more than one organization. Aquarium users with just one organization can omit this flag.

![Squid SDK](</img/sqd-explorer-snap.png>)

_See code: [src/commands/init.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/init.ts)_

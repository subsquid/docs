# Monitoring and sync status

The Subsquid SDK offers a useful command line tool to monitor the Cloud-deployed Squid. the `tail` subcommand will output the logs of a Squid, when providing its name and version.

The optional arguments `-f` and `-l <n>` will, respectively, make sure that the stream of logs is continuously updated and that the last `n` lines are shown, before outputting any new ones.

Let's take the example of our `SquidSaas` squid and fetch logs for its version labeled `1`:

```
⇒   sqd squid tail SquidSaas@1 -f -l 10
Getting logs...
Last block: 6935348, mapping: 26 blocks/sec, ingest: 660 blocks/sec, eta: 4h 36m, progress: 60%
Last block: 6941366, mapping: 30 blocks/sec, ingest: 546 blocks/sec, eta: 4h 35m, progress: 60%
Last block: 6944499, mapping: 29 blocks/sec, ingest: 511 blocks/sec, eta: 5h 23m, progress: 60%
Last block: 6949077, mapping: 29 blocks/sec, ingest: 491 blocks/sec, eta: 5h 1m, progress: 60%
Last block: 6954871, mapping: 32 blocks/sec, ingest: 378 blocks/sec, eta: 4h 23m, progress: 60%
Last block: 6960064, mapping: 28 blocks/sec, ingest: 400 blocks/sec, eta: 4h 40m, progress: 60%
Last block: 6968949, mapping: 32 blocks/sec, ingest: 339 blocks/sec, eta: 3h 29m, progress: 60%
Last block: 6976994, mapping: 28 blocks/sec, ingest: 447 blocks/sec, eta: 3h 4m, progress: 60%
```

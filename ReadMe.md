# Encode x Polkadot Spring 2023 Hackathon

## Subsquid: Giant Squid Challenge - 
## Status React Component for Giant Squid APIs

<br>

### Description: https://github.com/subsquid/bounties/issues/8
<br/>
To Install

    $yarn

To Run

    $npm start

Packages added: @polkadot/api and axios

<br/>

### Comments

At .src/components a react component for each API can be found.

Currently, for each parachain a socket is established to listen to every new block, which in turn updates the current block number for the parachain.

On a separate 12sec interval a query is sent to the Giant Squid for the same parachain to retrieve the current height of the index.

The relationship between the two status checks are monitored to calculate the syncing percentage between the Giant Squid and the individual parachains.

An alternative method can be achieved by commenting line

    setGsLastCheck(gs_lastCheck + 1);

in every component

and uncommenting

    // get_GiantSquidStatus();

so that the query to Giant Squid runs only once every new block is created

> Note: This way has the following issue. In the event that a parachain takes longer than the targetted 12secs to produce a block e.g. 30secs, the Giant Squid would have caught up with more blocks syncing. However since the Giant Squid query in this case is only sent after a fresh block is produced this information-cathing up will be missed out temporarily.

<br>

## Video / Demonstration
The snapshot below shows the modified Subsquid status page to include the live syncing status of each parachain.
<br>
There is no seperate demo website for this bounty as the Subsquid github repo was forked as requested and a pull request submitted after the final amendments were made.

<br>

![plot](./Encode-Polkadot-2023-Subsquid/GiantSquidStatus1.gif)

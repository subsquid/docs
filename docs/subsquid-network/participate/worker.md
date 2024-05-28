---
sidebar_position: 20
title: Run a worker
description: Serve Subsquid Network data
---

# Run a worker

## Requirements

To run a single worker you'll need:

* 4 vCPU
* 16GB RAM
* 1TB SSD
* stable 24/7 Internet connection, at least 1Gbit
* a public IP and two ports open for incoming traffic:
  - one UDP port for p2p communication (default 12345)
  - one TCP port for Prometheus metrics (default 9090)
* `100_000` `SQD` tokens (in your wallet or in a special vesting contract)
* some Arbitrum ETH (for gas)

A _Primary Wallet_ is your wallet that has the tokens or owns a vesting contract. With enough funds you can use one Primary Wallet to register multiple workers.

You can run a worker from a Docker image or from its source code.

## Running in a container

**Prerequisites:** Docker, Docker Compose (tested with version TBA)

1. Create a new directory and save the [`run_worker.sh`](https://gist.githubusercontent.com/Wiezzel/604a0d812c40ae64899ed2361b43b0e5/raw/run_worker.sh) script in it.

2. Generate your key file by running
   ```bash
   docker run --rm subsquid/rpc-node:0.2.5 keygen > <KEY_PATH>
   ```
   The command display your peer ID:
   ```
   Your peer ID: <THIS IS WHAT YOU NEED TO COPY>
   ```
   Please copy this ID, as it will be needed for [on-chain worker registration](#on-chain-registration).

   ⚠️ **Note:** Please make sure that the generated file is safe and secure at `<KEY_PATH>` (i.e. it will not be deleted accidentally and cannot be accessed by unauthorized parties).

3. [Register your worker](#on-chain-registration) by logging into [network.subsquid.io](https://network.subsquid.io) with the Primary Wallet you provided in the onboarding form. You will need the Peer ID from the previous step.

4. Make the `run_worker.sh` script executable and run
   ```bash
   PUBLIC_IP=<YOUR_PUBLIC_IP> ./run_worker.sh <DATA_DIR> up -d
   ```
   to start the node. `<DATA_DIR>` is a directory where the downloaded data will be stored – please make sure it exists and can accommodate up to 1 TB of data. If you want to use a different port than the default 12345, also set the `LISTEN_PORT` environment variable.

   ⚠️ **Note:** Setting `PUBLIC_IP` is currently required for the node to be publicly discoverable.

5. Check the status of the containers with `docker container ls`. Check the worker logs using `docker logs -f worker-1`. After some time the worker should output some info on the downloaded data chunks. See [Docker docs](https://docs.docker.com/engine/reference/commandline/logs/) for a reference of Docker commands.

## Building from the source

1. Install prerequisites (Python, Rust, Protobuf).

    ```bash
    apt install python3.11 python3.11-venv gcc protobuf-compiler
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

2. Clone & build a network node.

    ```bash
    git clone https://github.com/subsquid/subsquid-network
    cd subsquid-network/transport
    cargo build --release --bin node
    ```

3. Create a new Python virtual env and install the worker package.

    ```bash
    python3.11 -m venv env
    . env/bin/activate
    pip install -U "subsquid-eth-archive[p2p-worker] @ git+https://github.com/subsquid/archive.py.git@0.2.4"
    ```

4. Enter the `subsquid-network/transport` directory and generate your `key` file by running
   ```bash
   cargo run --bin keygen > <KEY_PATH>
   ```
   The command display your peer ID:
   ```
   Your peer ID: <THIS IS WHAT YOU NEED TO COPY>
   ```
   Please copy this ID, as it will be needed for [on-chain worker registration](#on-chain-registration).

   ⚠️ **Note:** Please make sure that the generated file is safe and secure at `<KEY_PATH>` (i.e. it will not be deleted accidentally and cannot be accessed by unauthorized parties).

5. [Register your worker](#on-chain-registration) by logging into [network.subsquid.io](https://network.subsquid.io) with the Primary Wallet you provided in the onboarding form. You will need the Peer ID from the previous step.

6. Make sure you're at `subsquid-network/transport` and run the network node:
   ```bash
   nohup cargo run --release --bin node -- \
       --p2p-listen-addrs /ip4/0.0.0.0/udp/12345/quic-v1 \
       --key <KEY_PATH> \
       --boot-nodes '12D3KooWSRvKpvNbsrGbLXGFZV7GYdcrYNh4W2nipwHHMYikzV58 /dns4/testnet.subsquid.io/udp/22445/quic-v1' \
       --boot-nodes '12D3KooWQC9tPzj2ShLn39RFHS5SGbvbP2pEd7bJ61kSW2LwxGSB /dns4/testnet.subsquid.io/udp/22446/quic-v1' \
       --bootstrap \
       > network.log 2>&1 &
   ```
   The command uses `nohup`, but you may also consider daemonizing it with `systemd`. The libp2p address+port combination, specified by the `--p2p-listen-addr` flag, should be available for external connections. In the reference command above the node listens on `12345`.

    If you see the following error, ignore it.

    ```
    2023-06-21T08:59:52.427Z ERROR [subsquid_network_transport::transport] Error broadcasting message: InsufficientPeers
    ```

   ⚠️  **Warning:** Be careful when supplying the path to the key you created at step 4 via `--key`. If you supply the wrong path, a new random key will be automatically created there and your node will attempt to operate with a new (unregistered) peer ID - unsuccessfully.

7. Set up the credentials for read-only S3 access, sentry, and RPC via env variables:

    ```bash
    cat <<EOF > .worker-env
    export AWS_ACCESS_KEY_ID=66dfc7705583f6fd9520947ac10d7e9f
    export AWS_SECRET_ACCESS_KEY=a68fdd7253232e30720a4c125f35a81bd495664a154b1643b5f5d4a4a5280a4f
    export AWS_S3_ENDPOINT=https://7a28e49ec5f4a60c66f216392792ac38.r2.cloudflarestorage.com
    export AWS_REGION=auto
    export SENTRY_DSN=https://3d427b41736042ae85010ec2dc864f05@o1149243.ingest.sentry.io/4505589334081536
    EOF

    source .worker-env
    ```

8. Run the worker process in a terminal where you have your virtualenv active. You may run it with `systemd` instead of `nohup` to tolerate server restarts.

    ```bash
    nohup python -m sqa.worker.p2p \
        --scheduler-id 12D3KooWQER7HEpwsvqSzqzaiV36d3Bn6DZrnwEunnzS76pgZkMU \
        --logs-collector-id 12D3KooWC3GvQVqnvPwWz23sTW8G8HVokMnox62A7mnL9wwaSujk \
        --data-dir </path/where/you/want/to/store/downloaded/data> \
        --proxy localhost:50051 \
        --prometheus-port <port_on_which_you_want_to_expose_prometheus_metrics> \
        --rpc-url https://sepolia-rollup.arbitrum.io/rpc \
        > worker.log 2>&1 &
    ```
   The `--data-dir` path must be able to accommodate up to 1Tb of data.

## On-chain registration

Before you run a worker node, you need to register it on-chain using our web application. Here are the steps to do this:

1. Go to [https://network.subsquid.io](https://network.subsquid.io).

2. Connect your EVM wallet (we recommend using Metamask). Use the Primary Wallet holding the tokens or linked to the vesting contract.
   ![Connect wallet button](./worker_registration_wallet.png)

3. Go Profile -> My Workers -> Add Worker

4. You should see a vesting contract owned by your primary wallet and pre-funded with tSQD
   ![Worker registration form](./worker_registration_form.png)

5. Fill the form and submit it by signing a transaction. Use the PeerID of the worker you are registering

6. Repeat steps 3-5 if you want to run more workers

7. Go to "My Workers" tabs and wait until the status of all registered workers changes to "Active". Since the workers can only be activated at a beginning of an epoch, you may have to wait for a few minutes

## Troubleshooting

### Where do I find my peer ID ?

It is printed when you run `keygen` (see the steps for running worker).

It is also in the first line of the worker log output. For the docker setup, list the containers with `docker container ls` and inspect the `rpc_node` container logs with `docker logs -f <rpc_node_container_id>`.

If you installed your worker from source, check the `network.log` file.

In both cases, the log line you are looking for should look like this

```
INFO  [subsquid_network_transport::transport] Local peer ID: <THIS IS WHAT YOU NEED TO COPY>
```

[//]: # (## How do I get `SQD` tokens ?)

### I see `Insufficient peers...` error in the worker logs

Just ignore it

### Can I move my worker to another server

Yes, copy the key file (at `<KEY_PATH>`) to the new working directory before starting. You don't need to re-register your worker.

### I have just started my worker but see no logs

This is normal. Wait for a few minutes and the logs should show some data being downloaded.

### Should I build it from source or run with Docker?

Docker makes for an easier setup. Building from sources is suitable only for experienced Linux/Unix users.

### How do I check that my worker is updated to the latest version?

Check the [pings endpoint](https://scheduler.testnet.subsquid.io/workers/pings) and locate the version by your PeerID.

### Which Linux distro is recommended?

We recommend Ubuntu 22.04 LTS.

### I see `error from daemon in stream: Error grabbing logs`

This is a Docker issue, not a problem with the worker. Look at [this GitHub issue](https://github.com/docker/for-linux/issues/140) and [this Stackoverflow thread](https://stackoverflow.com/questions/46843711/docker-error-grabbing-logs-invalid-character-x00-looking-for-beginning-of-v) for more context.

### How do I check if my worker is up-to-date and running?

Copy your peer ID and look for an entry on [this page](https://scheduler.testnet.subsquid.io/workers/pings). If the last ping timestamp is 1 minute ago, and the listed version is the most recent one, you should be good. Alternatively, you can use [this Python script](https://gist.github.com/Wiezzel/6e7577ee439b055a28d6980b0a217aa4).

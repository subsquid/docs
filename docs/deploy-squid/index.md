---
sidebar_position: 7
title: Deploy a Squid
---


# Deploy a squid

This section goes through deploying a squid to [Aquarium](https://app.subsquid.io) -- a cloud API service provided by Subsquid.
The deployment is managed by the file `squid.yaml` in the root folder of the squid and defines:

- the squid name and version
- what services should be deployed for the squid (e.g. postgres, processor, api)
- how the squid should be scaled up if it grows bigger

See the [Deploy Manifest page](/deploy-squid/deploy-manifest) for a full reference.


## 0. Install and setup Squid CLI

First, install the latest version of Subsquid CLI.
The recommended way for macOS and Linux is to use Homebrew:
```bash
brew tap subsquid/cli
brew install sqd
```

Otherwise, install as a global npm package:
```bash
npm i -g @subsquid/cli@latest
```

Check the version is at least `1.x`:
```bash
sqd --version
```

:::info 
The manifest-based deployment flow below was introduced in `@subsquid/cli` version `1.x`. 
Follow the [migration guide](/deploy-squid/migration) to upgrade from `@subsquid/cli` version `0.x`.
:::


## 1. Obtain an Aquarium deployment key

Sign in to [Aquarium](https://app.subsquid.io/aquarium), and obtain (or refresh) the deployment key on the account page by clicking at the profile picture at the bottom:

![Aquarium homepage](/img/.gitbook/assets/deployment-key.png)


## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Inspect and deploy using the manifest

Navigate to the squid folder and make sure `squid.yaml` is present in the root. See the [Deploy Manifest page](/deploy-squid/deploy-manifest) for a full reference.

To deploy a new version or update the existing one (define in the manifest), run
```bash
sqd deploy .
```

For a full list of availbale deploy options, inspect `sqd deploy --help`.

## 4. Monitor Squid logs

Once the squid is deployed, the GraphQL endpoint is available straight away. Normally one should wait until the squid has processed all historical blocks and is fully in sync.

To inspect the squid logs run

```bash
sqd squid logs my-new-squid@v0 -f 
```

or navigate to the squid page in Aquarium.

## What's next?

- See how to [update and kill the deployed squid versions](/deploy-squid/update-and-kill)
- See [Secrets and Env variables](/deploy-squid/env-variables) to add secrets and environment variables to a squid deployment.
- See [`squid` reference](/deploy-squid/squid-cli) for a full list of supported options for `squid logs`.

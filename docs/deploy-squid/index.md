---
sidebar_position: 7
title: Deploy a Squid
---


# Deploy a Squid

This section goes through deploying a squid to [Aquarium](https://app.subsquid.io) -- a cloud API service provided by Subsquid.
The following steps are performed by the Aquarium deployment service under the hood:
- Checkout the squid from a remote URL
- Build Docker images for the substrate-processor and the API server -- same as when [built locally](/run-squid/run-in-docker)
- Set up a Postgres database 
- Set the `DB_XXX` variables and start containers for the squid processor and the squid API server
- Wait until the squid processor Prometheus metrics are available and the squid API server is online

## 0. Install Squid CLI

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
and check the version with
```bash
sqd --version
```

Navigate to the squid folder and make sure you have the `subsquid` packages updated. Use the following templates as a reference:
- [EVM template](https://github.com/subsquid/squid-ethereum-template) for EVM-based chains
- [Substrate template](https://github.com/subsquid/squid-substrate-template) for Substrate-based chains
- [EVM-Frontier template](https://github.com/subsquid/https://github.com/subsquid/squid-frontier-evm-template) for Substrate-based Frontier EVM chains.

 Further, ensure that the squid structure follows [the conventions](/develop-a-squid/squid-structure). All the scripts below are assumed to be run from the root folder of your squid. 

Note, that the local `.env` file is ignored by Aquarium. The environment variables `DB_NAME`, `DB_PASS`, `DB_PORT` are automatically set by Aquarium. The support for user-defined environment variables and secrets is currently in private beta and will be available soon.

## 1. Obtain an Aquarium deployment key

Sign in to [Aquarium](https://app.subsquid.io/aquarium), and obtain (or refresh) the deployment key on the account page by clicking at the profile picture at the bottom:

![Aquarium homepage](/img/.gitbook/assets/deployment-key.png)


## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Create a new squid project in Aquarium

```bash
sqd squid create my-new-squid
```

Once the squid project is created, it will appear in `My Squids` Aquarium section and can also be inspected with

```bash
sqd squid ls
```

The command has optional attributes `--description`, `--logo`, `--website` to populate the corresponding fields. One can edit them later in Aquarium.

## 4. Release ~~the kraken~~ a squid version

:::info
If there are other deployed squid versions, consider [updating the existing versions](/deploy-squid/update-and-kill) instead of releasing a new one. 
:::

Every instance of a squid API is identified by the squid project name and the version name, with a shortcut `<squid name>@<version name>`. A version name can be any alphanumeric string. One can also add a description to a squid version either with the `--description` flag or in Aquarium.

### **Option 1. Auto-detect the remote URL**

Before releasing, make sure that local changes are committed and pushed to a remote git repo. Let's release `my-new-squid@v0` version:

```bash
sqd squid release my-new-squid@v0
```

If there are multiple remotes for your local repo, it will prompt which git remote to choose.

### **Option 2. Explicitly set the source URL**

It is also possible to release a squid from a remote repo using a full git link with the `--source` option. Note that a fully qualified git URL is either of the form `https://my-git-repo.git#my-branch` or `https://my-git-repo.git#<commit-hash>`. We recommend using fully qualified git URLs with a commit hash, like below:

```bash
sqd squid release my-new-squid@v0 --source https://github.com/dzhelezov/squid-substrate-template.git#b71e545c1a5e683013023ef572f86fdeddf5f7b7
```

:::info
To deploy a squid from a private repo create a [GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and provide the source URL in the form
```bash
sqd squid release my-new-squid@v0 --source https://<token>@github.com/<username>/<your-private-repo>.git#<branch> -v
```
Once the squid is deployed, the token can be deleted.
:::

Both options will provide deployment logs.

:::tip
For additional logs to troubleshoot deploy or update issues, set `API_DEBUG` env variable to `true`:
```bash
API_DEBUG=true sqd squid release my-new-squid@v0
```
::: 

## 5. Monitor Squid logs

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

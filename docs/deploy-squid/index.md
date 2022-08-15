---
sidebar_position: 7
title: Deploy a Squid
---


# Deploy a Squid

This section goes through deploying a squid to [Aquarium](https://app.subsquid.io) -- a cloud API service provided by Subsquid.

## 0. Prerequisites

Make sure you have the `subsquid` packages updated, as in the [squid-template repo](https://github.com/subsquid/squid-template).
Further, ensure that the squid structure follows [the conventions](/develop-a-squid/squid-structure). All the scripts below are assumed to be run from the root folder of your squid. 

Note, that the local `.env` file is ignored by Aquarium. The environment variables `DB_NAME`, `DB_PASS`, `DB_PORT` are automatically set by Aquarium. The support for user-defined environment variables and secrets is currently in private beta and will be available soon.

## 1. Obtain an Aquarium deployment key

Sign in to [Aquarium](https://app.subsquid.io/aquarium), and obtain (or refresh) the deployment key on the account page:

![Aquarium homepage](/img/.gitbook/assets/deployment-key.png)


## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
npx sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Create a new squid project

```bash
npx sqd squid create my-new-squid
```

Once the squid project is created, it will appear in `My Squids` Aquarium section and can also be inspected with

```bash
npx sqd squid ls
```

The command has optional attributes `--description`, `--logo`, `--website` to populate the corresponding fields. One can edit them later in Aquarium.

## 4. Release ~~the kraken~~ a squid version

:::info
If there are other deployed squid versions, consider [updating the existing versions](/deploy-squid/update-and-kill) instead of releasing a new one. 
:::


Every instance of a squid API is identified by the squid project name and the version name, with a shortcut `<squid name>@<version name>`. A version name can be any alphanumeric string. One can also add a description to a squid version either with the `--description` flag or in Aquarium.

**Option 1. Releasing from a local repo**

Before releasing, make sure that local changes are committed and pushed to a remote git repo. Let's release `my-new-sqiod@v0` version:

```bash
npx sqd squid release my-new-squid@v0 -v
```

If there are multiple remotes for your local repo, it will prompt which git remote to choose.

**Option 2. Releasing from a remote repo**

It is also possible to release a squid from a remote repo using a full git link with the `--source` option. Note that a fully qualified git URL is either of the form `https://my-git-repo.git#my-branch` or `https://my-git-repo.git#<commit-hash>`. We recommend using fully qualified git URLs with a commit hash, like below:

```bash
npx sqd squid release my-new-squid@v0 --source https://github.com/dzhelezov/squid-template.git#b71e545c1a5e683013023ef572f86fdeddf5f7b7 -v
```

Both options will provide deployment logs. 

## 5. Monitor Squid logs

Once the squid is deployed, the GraphQL endpoint is available straight away. Normally one should wait until the squid has processed all historical blocks and is fully in sync.

To inspect the squid logs run 

```
npx sqd squid logs my-new-squid@v0 -f 
```

or navigate to the squid page in Aquarium.


### What's next?

- See how to [update and kill the deployed squid versions](/deploy-squid/update-and-kill)
- See [Secrets and Env variables](/deploy-squid/env-variables) to add secrets and environment variables to a squid deployment.
- See [`squid` reference](/deploy-squid/squid-cli) for a full list of supported options for `squid logs`.

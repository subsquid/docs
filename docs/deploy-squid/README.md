---
sidebar_position: 7
title: Deploy a Squid
---


# Deploy a Squid

This section goes through deploying a squid to [Aquarium](https://app.subsquid.io) -- a cloud API service provided by Subsquid.

## 0. Prerequisites

Make sure you have the `subsquid` packages updated, as in the [squid-template repo](https://github.com/subsquid/squid-template).
All the scripts below are assumed to be run from the root folder of your squid.

## 1. Obtain an Aquarium deployment key

Sign in to [Aquarium](https://app.subsquid.io/aquarium), and obtain (or refresh) the deployment key on the account page:

![Subsquid Saas homepage](/img/.gitbook/assets/deployment-key.png)


## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
npx sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Create a new squid project

```bash
npx sqd squid create my-new-squid
```

Once the squid project is created, it will appear in `My Squids` Aquarium section. 

The command has optional attributes `--description`, `--logo`, `--website` to populate the corresponding fields. One can edit them later in Aquarium.

## 4. Release ~~the kraken~~ a squid version

Every instance of a squid API is identified by the squid project name and the version name, with a shortcut `<squid name>@<version name>`. A version name can be any alphanumeric string. One can also add a description to a squid version either with the `--description` flag or in Aquarium.

**Option 1. Releasing from a local repo**

Before releasing, make sure that local changes are committed and pushed to a remote git repo. Let's release `my-new-squod@v0` version:

```bash
npx sqd squid release my-new-squid@v0 -v
```

If there are multiple remotes for your local repo, it will prompt which git remote to choose.

**Option 2. Releasing from a remote repo**

It is also possible to release a squid using from a remote repo using a full git link with `--source` option. Note that a fully qualified git url is either of the form `https://my-git-repo.git#my-branch` or `https://my-git-repo.git#some-commit-hash`. We recommend using fully qualified git urls with a commit hash, like below:

```bash
npx sqd squid release my-new-squid@v0 --source https://github.com/dzhelezov/squid-template.git#b71e545c1a5e683013023ef572f86fdeddf5f7b7 -v
```

Both options will provide deployment logs

## 5. Monitor Squid logs

To inspect the squid logs run 

```
npx sqd squid logs my-new-squid@v0 -f 
```

See [CLI Reference](./squid-cli/squid.md) for a full list of supported options for `squid logs`.

## 6. Update a squid version

An existing squid version can be updated with a `sqd squid update` which is similar to `squid release`. Use 
```
npx sqd squid update my-new-squid@v0 -v
```
or

```
npx sqd squid update my-new-squid@v0 -v --source <repo.git>#<commit>
```

to update the version. By default, `sqd squid update` only updates the squid images and does not drop the database (but applies the new migrations from the `db/migrations` folder). Thus, the squid sync will continue from its last state. To force the database wipeout and start the squid sync from scratch, add `--hardReset` flag:

```
npx sqd squid update my-new-squid@v0 -v --source <repo.git>#<commit> --hardReset
```

Note that the total number of deployed squid versions is limited to three, so we strongly recommend updating existing squid versions rather than creating new ones. 

## 7. Kill an unused version

Unused versions can be killed with 
`npx sqd squid kill <name>@<version>`.
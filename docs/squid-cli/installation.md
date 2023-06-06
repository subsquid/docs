---
sidebar_position: 10
description: Setup Squid CLI
---

# Installation

Squid CLI is a command line tool for

- scaffolding new squids from templates
- running SDK tools and scripts defined in `commands.json` in a cross-platform way
- managing squid deployments in the [Aquarium hosted service](/deploy-squid)

The CLI is distributed as a [`npm` package](https://www.npmjs.com/package/@subsquid/cli). 

To install Squid CLI, follow the steps below.

## 0. Install and setup Squid CLI

First, install the latest version of Subsquid CLI as a global `npm` package:
```bash
npm i -g @subsquid/cli@latest
```

Check the version:
```bash
sqd --version
```
Make sure the output looks like `@subsquid/cli@<version>`.

:::info
The next steps are **optional** for building and running squids. A key is required to enable the CLI commands managing the [Aquarium hosted service](/deploy-squid) deployments.
:::

## 1. Obtain an Aquarium deployment key

Sign in to [Aquarium](https://app.subsquid.io/aquarium), and obtain (or refresh) the deployment key on the account page by clicking at the profile picture at the bottom:

![Aquarium homepage](/img/.gitbook/assets/deployment-key.png)


## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Explore with `--help`

Use `sqd --help` to get a list of the available command and `sqd <command> --help` to get help on the available options for a specfic command, e.g.

```bash
sqd deploy --help
```

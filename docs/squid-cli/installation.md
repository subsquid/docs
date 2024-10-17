---
sidebar_position: 10
description: Setup Squid CLI
---

# Installation

Squid CLI is a command line tool for

- scaffolding new squids from templates
- running SDK tools and scripts defined in `commands.json` in a cross-platform way
- managing squid deployments in [SQD Cloud](/cloud) (former Aquarium)

The CLI is distributed as a [`npm` package](https://www.npmjs.com/package/@subsquid/cli). 

To install Squid CLI, follow the steps below.

## 0. Install and setup Squid CLI

First, install the latest version of Squid CLI as a global `npm` package:
```bash
npm i -g @subsquid/cli@latest
```

Check the version:
```bash
sqd --version
```
Make sure the output looks like `@subsquid/cli@<version>`.

:::info
The next steps are **optional** for building and running squids. A key is required to enable the CLI commands managing the [SQD Cloud](/cloud) deployments.
:::

## 1. Obtain a SQD Cloud deployment key

Sign in to [Cloud](https://app.subsquid.io/), and obtain (or refresh) the deployment key page by clicking at the profile picture > "Deployment key":

![Cloud deployment key page](./installation-deployment-key.png)

## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Explore with `--help`

Use `sqd --help` to get a list of the available command and `sqd <command> --help` to get help on the available options for a specific command, e.g.

```bash
sqd deploy --help
```

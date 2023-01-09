---
sidebar_position: 10
description: Setup Squid CLI
---

# Installation

Squid CLI is an overarching command line tool to 

- manage squid deployments in Aquarium 
- scaffold new squid from templates

The CLI is distributed as a [`npm` package](https://www.npmjs.com/package/@subsquid/cli). 

To install Squid CLI, follow the steps below.

## 0. Install and setup Squid CLI

First, install the latest version of Subsquid CLI.
The recommended way for macOS and Linux is to use Homebrew:
```bash
brew tap subsquid/cli
brew install sqd
```

Otherwise, install as a global `npm` package:
```bash
npm i -g @subsquid/cli@latest
```

Check the version:
```bash
sqd --version
```

Make sure the output looks like `@subsquid/cli@<version>`.

## 1. Obtain an Aquarium deployment key

Sign in to [Aquarium](https://app.subsquid.io/aquarium), and obtain (or refresh) the deployment key on the account page by clicking at the profile picture at the bottom:

![Aquarium homepage](/img/.gitbook/assets/deployment-key.png)


## 2. Authenticate Squid CLI

Open a terminal window and run 

```bash
sqd auth -k <DEPLOYMENT_KEY>
```

## 3. Explore with `--help`

Use `sqd --help` to get a list of the available command and `sqd <commad> --help` to get help on the available options for a specfic command, e.g.

```bash
sqd deploy --help
```
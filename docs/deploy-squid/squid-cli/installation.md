# Installation

## Installation

The Squid CLI is a tool that helps develop and manage your Squid project. It provides multiple utilities, from database management to SaaS control, to code generation.

<<<<<<< HEAD:docs-archive/deploy-squid/squid-cli/installation.md
:::info
Note: in the context of this guide, we assume the [Development Environment has been already set up](subsquid-docs/tutorial/development-environment-set-up.md) and that `npm` is used, although other options are available.
:::
=======
:::info
Note: in the context of this guide, we assume the [Development Environment has been already set up](../../tutorial/development-environment-set-up.md) and that `npm` is used, although other options are available.
:::
>>>>>>> 224818f (Add draft version):docs/reference/squid-cli/installation.md

To install Squid CLI, simply run this in a console.

```
npm install -g @subsquid/cli
```

:::info
Bear in mind that `-g` option will install it globally.

Alternatively, you can remove the option if you prefer not to, and run the cli with `npx`
:::

Once installed, check available commands by running

```
sqd --help
```

Which will print out a help. You can obtain help for individual commands in the same way, by specifying it after `sqd` and before the `--help` option. For example, for the `db` command:

```
sqd db --help
```

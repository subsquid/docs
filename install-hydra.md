# Install Hydra

## Prerequisites

* Unix-based operating system \(Mac or Linux\), you may experience issues on Windows.
* Node 14.x
* Hydra stores the substrate data in an external PostgresSQL 12 instance. The scaffolding tool provides a convenient setup for running the database instance from a Docker image. In this case the standard docker environment \(`docker` and `docker-compose`\) should be available.

## Installation

The best way to start is to clone the [template repo](https://github.com/subsquid/hydra-template) and proceed
from there. Otherwise, the scaffold command is also available with installation steps outlined below.

{% hint style="warning" %}
Use `@subsquid/hydra-cli@next` for the most recent development version
{% endhint %}

_Global installation:_

```bash
npm install -g @subsquid/hydra-cli
```

The path to `hydra-cli` binaries will be added to the system-wide `$PATH`.

_Isolated set-up:_

Execute `hydra-cli` commands directly by typing

```bash
npx @subsquid/hydra-cli <command>
```

This provides an isolated way to execute `hydra-cli` commands.

{% hint style="success" %}
Run `hydra-cli --version` to check your installation
{% endhint %}

{% hint style="info" %}
It may be convenient to create an alias for quick access to `hydra-cli` e.g.

```text
alias hydra-cli='npx @subsquid/hydra-cli'
```

Or on Windows you can use:

```text
doskey hydra-cli=npx @subsquid/hydra-cli
```
{% endhint %}

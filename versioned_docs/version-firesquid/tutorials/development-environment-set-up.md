---
sidebar_position: 1
description: >-
  Prepare for working with Squid SDK
---

# Environment set up

### Node.js

For Squid to run we need to have Node.js installed. To do that:

* **On Linux:** Use the package manager of you distro or the [official binaries](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).
* **On MacOS:** An easy way is to use [Homebrew](https://nodejs.org/en/download/package-manager/#alternatives-2).
* **On Windows:** The best bet is to leverage WSL2 and follow [this guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl). Alternatively, simply use the instructions for Linux directly in WSL.

If Node.js is already present in the system, ensure that version 16 or later is installed. To get the installed version, run:

```bash
node --version
```

### Subsquid CLI

Follow [these instructions](/squid-cli/installation).

### Docker

The other requisite is Docker, which has similar options:

* [Here’s an example](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) of how to install Docker on Ubuntu
* MacOS users have a [Desktop version](https://docs.docker.com/desktop/mac/install/)
* And so do [Windows users](https://docs.docker.com/desktop/windows/install/)

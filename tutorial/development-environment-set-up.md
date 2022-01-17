---
description: >-
  Prepare your Development Environment to run, customize and build a Squid
  Template
---

# Development Environment set up

### Node.js

For Squid to run we need to have installed Node.js. As for how to install it:

* There are binaries ready for many Linux distributions [users can install](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* Mac OS users will find it as easy as using [Homebrew](https://nodejs.org/en/download/package-manager/#alternatives-2),&#x20;
* For Windows, the best bet is to leverage WSL2 and follow [this guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) or even simpler use Linux options directly in WSL.

If Node.js is already present in the system, be sure to have version 16 or later installed, by running:

```
node --version
```

### Docker

The other requisite is Docker, which has similar options:

* [Here’s an example](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) of how to install Docker on Ubuntu
* Mac OS users have a [Desktop version](https://docs.docker.com/desktop/mac/install/)
* And so have [Windows users](https://docs.docker.com/desktop/windows/install/)

---
sidebar_position: 20
title: commands.json
description: Dynamic sqd commands
---

# commands.json

The `sqd` tool automatically discovers and loads any extra commands defined in the `commands.json` file. Here is a sample file demonstrating the available features:

```json
{ // comments are ok
  "$schema": "https://subsquid.io/schemas/commands.json",
  "commands": {
    "clean": {
      "description": "delete all build artifacts",
      "cmd": ["rm", "-rf", "lib"]
    },
    "build": {
      "description": "build the project",
      "deps": ["clean"], // commands to execute before
      "cmd": ["tsc"]
    },
    "typegen": {
      "hidden": true, // Don't show in the overview listing
      "workdir": "abi", // change working dir
      "command": [
        "squid-evm-typegen", // node_modules/.bin is in the PATH
        "../src/abi",
        {"glob": "*.json"} // cross-platform glob expansion
      ],
      "env": { // additional environment variables
        "DEBUG": "*"
      }
    }
  }
}
```
This functionality is managed by the [`@subsquid/commands`](https://github.com/subsquid/squid-sdk/tree/master/util/commands) package.

All [squid templates](/sdk/how-to-start/squid-development/#templates) include such a file with a predefined set of useful shortcuts. See [Cheatsheet](/sdk/how-to-start/cli-cheatsheet).

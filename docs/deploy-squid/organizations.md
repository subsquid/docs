---
sidebar_position: 85
title: Organizations
description: |- 
  Group your squids
---

# Organizations

**Available since `@subsquid/cli@2.4.0`**

Squids within each Aquarium account are grouped into *organizations*. You will have to create one when you first log into the service, then you may choose to add more. Besides simply organizing your workspace, this additional layer of hierarchy enables you to prevent some unnecessary data sharing, as [environment variables](../env-variables) are kept separate between organization.

When your account has more than one organization, it is necessary to specify one when [listing](/squid-cli/ls), [exploring](/squid-cli/explorer) or [deploying](/squid-cli/deploy) (with some exceptions) your squids, as well as when [setting environment variables/secrets](/squid-cli/secrets). Do it with the `--org/-o` flag:

```bash
sqd secrets ls -o my-organization
sqd secrets rm SECRET --org my-organization
sqd secrets set SECRET --org my-organization

sqd ls -o my-organization
sqd explorer -o my-organization
sqd deploy . -o my-organization
```

If you omit the flag, `sqd` will ask you to choose an organization interactively.

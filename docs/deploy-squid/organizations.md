---
sidebar_position: 85
title: Organizations
description: |- 
  Group your squids
---

# Organizations

All squids within Subsquid Cloud are grouped into *organizations*. This additional layer of hierarchy enables team access and per-team billing. It also prevents unnecessary data sharing, as [environment variables](../env-variables) are separate between organizations.

To create an organization, click on the organizations dropdown menu in the upper left corner of the [Cloud homepage](https://app.subsquid.io/) and select "Create new organization".

![Creation of an organization](./create-an-organization.png)

## Playgrounds

A playground organization is created for each account on its first login. There, you can deploy one squid for development or prototyping, free of charge.

Playground squids cannot be used in production, as they are [collocated](/deploy-squid/scale/#dedicated) and run on [spot VMs](https://cloud.google.com/spot-vms). Expect a 3-5 minutes downtime once every few days.

Unlike other organizations, playgrounds cannot be shared or billed. 

## Draft organizations

Freshly created organizations are marked as drafts until [upgraded to Professional status](/dead). It is not possible to deploy squids to draft organizations, but you can invite other users into them and set [environment variables](../env-variables).

## Working with organizations

When your account has access to more than one organization, it is necessary to specify one when [listing](/squid-cli/ls), [exploring](/squid-cli/explorer) or [deploying](/squid-cli/deploy) (with some exceptions) your squids, as well as when [setting environment variables/secrets](/squid-cli/secrets). Do it with the `--org/-o` flag:

```bash
sqd secrets ls -o my-organization
sqd secrets rm SECRET --org my-organization
sqd secrets set SECRET --org my-organization

sqd ls -o my-organization
sqd explorer -o my-organization
sqd deploy . -o my-organization
```

If you omit the flag, `sqd` will ask you to choose an organization interactively.

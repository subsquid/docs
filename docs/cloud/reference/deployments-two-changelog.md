---
sidebar_position: 60
title: 'Changelog: slots and tags'
description: Update details for existing users
---

# Сhangelog: slots and tags update

:::tip
Take a look at the [slots and tags guide page](/cloud/resources/slots-and-tags) for practical instructions on using the system.
:::

## Motivation

When we initially built the [original deployment flow](/cloud/resources/production-alias) versions felt appropriate. A simple number you could increment on each deployment if necessary. This worked well in simple scenarios, but over time this gradually became more difficult to manage for those of you with any kind of deployment complexity.

At the same time it became clear that our solution to endpoint management, allowing you to mark a squid as production and create a permalink, was equally powerful in basic scenarios but limited as requirements grew.

It became clear that was lacking here was the ability for larger teams to collaborate effectively. Our goal with these changes is to provide the power and flexibility that more complex deployment flows need.

## Concepts

| Concepts                | Before                                    | After                                              |
|-------------------------|-------------------------------------------|----------------------------------------------------|
| Version                 | Existed                                   | Removed (replaced with slots)                      |
| Slot                    | Did not exist                             | Introduced (unique identifier for configs)         |
| Production alias        | Existed                                   | Deprecated (use tags)                              |
| Tag                     | Did not exist                             | Introduced (user-defined labels for deployments)   |
| Reference               | Existed                                   | Exists, but the format has changed                 |

New concepts are explained in detail in [the guide](/cloud/resources/slots-and-tags).

## Format changes

| Value         | Before                                                  | After                                                 |
|---------------|---------------------------------------------------------|-------------------------------------------------------|
| Version       | Must be a number                                        | Deprecated                                            |
| Slot          | Did not exist                        | A string of up to six lower case alphanumeric characters, dashes allowed |
| Tag           | Did not exist                                   | A string of lowercase alphanumeric characters, dashes allowed |
| Reference     | `<name>@v<version>`                                     | `[<org>/]<name>(@<slot>\|:<tag>)`                     |
| Canonical URL | `https://<org>.squids.live/<name>/v/v<version>/graphql` | `https://<org>.squids.live/<name>@<slot>/api/graphql` |
| [Production URL](/cloud/resources/production-alias) | `https://<org>.squids.live/<name>/graphql` | Deprecated. See also [backwards compatibility](#backwards-compatibility). |
| Tag URL       | Did not exist                                           | `https://<org>.squids.live/<name>:<tag>/api/graphql`  |

## Manifest changes

| Field       | Before  | After                          |
|-------------|---------|--------------------------------|
| name        | Present | Present                        |
| version     | Present | Deprecated (mapped to slot)    |
| slot        | Absent  | New field (unique identifier)  |
| tag         | Absent  | New field (user-defined label) |

## CLI changes

Changes to [CLI behavior](/squid-cli) are rather extensive:

* New flags `--name/-n`, `--tag/-t`, `--slot/-s`, `--reference/-r` have been added to nearly all commands.
  - For `sqd deploy` they now can override their corresponding [manifest fields](#manifest-changes). Heterogenous overrides also work: `-t` in CLI overrides `slot:` in manifest, and `-s` overrides `tag:`.
  - For other commands (`sqd logs`, `sqd restart` etc) they allow for flexible specification of deployment.
* New commands `sqd tags add` and `sqd tags remove` have been added.
* The `sqd prod` command has been removed.

Here's what the new commands look like for some common tasks:

| Action                                                  | Before                                    | After                                        |
|---------------------------------------------------------|-------------------------------------------|----------------------------------------------|
| Deploying prod version                                  | `sqd deploy . && sqd prod my-squid@v1`    | `sqd deploy . --add-tag prod`                |
| Promoting to prod                                       | `sqd prod my-squid@v1`                    | `sqd tags add prod -n my-squid -s v1`        |
| Marking a deployment as a "dev" version                 | Was not possible                          | `sqd tags add dev -n my-squid -s v1`         |
| Updating the "dev" version                              | Was not possible                          | `sqd deploy . -t dev`                        |
| Fetching logs                                           | `sqd logs my-squid@v1`                    | `sqd logs -n my-squid -s v1`                 |

### Cheatsheet

**Add tag `testtag` to the deployment of `my-squid` running in slot `v1`**

```bash
sqd tags add testtag -n my-squid -s v1
```
**(Re)deploy the squid and immediately assign the tag `testtag` to the deployment**

```bash
sqd deploy . --add-tag testtag
```

* The squid will be redeployed if one of the `tag:`, `slot:` or `version:` fields are defined in the manifest and the Cloud already has a deployment that matches the reference.
* If the fields are undefined or there's no matching squid in the Cloud, a new deployment will be created in a new slot.
* Tag `testtag` will be assigned to the slot of the (possibly new) deployment.

**Update the deployment tagged `dev`**

```bash
sqd deploy . --tag dev
```

* If there's a deployment tagged `dev`, it will be updated.
* Otherwise, the command will exit with an error.

**Read logs of the deployment of `my-squid` tagged `prod`**

```bash
sqd logs -n my-squid -t prod
```

## Backwards compatibility

Here are the measures we've taken to make the migration smoother:

* Existing deployments lose their versions; instead, they are assigned to the corresponding `v<version>` slots. New deployments that specify `version:` in the manifest will be assigned to the `v<version>` slot, too. Hence, for the time being the lines
  ```yaml
  version: 42
  ```
  and
  ```yaml
  slot: v42
  ```
  in the manifest file are equivalent.
* Tag `prod` has a special meaning for the duration of the transition period: deployments that have it are made available via old-style [production URLs](/cloud/resources/production-alias).
* Tag `prod` is assigned to all existing deployments with [production aliases](/cloud/resources/production-alias).
* You can, for the time being, add an old-style production URL to any deployment - just assign the `prod` tag to it.

## FAQs

#### Do I need to redeploy anything?

No. But we suggest you take a look at the [Backwards compatibility](#backwards-compatibility) section.

#### We really like versions, they work well for us, do we need to change our workflow?

No, you don't need to change your workflow at all! Your version will be migrated into the new slot field, and slots are a just an arbitrary string between 2 and 6 characters in length. Our goal was to expand functionality rather than remove it.

#### Why should I use tags? Convince me.

Tags serve two key roles. Firstly as a labelling mechanism, this allows teams to explicitly describe what each squid does and what stage it's at in development. Secondly as a way to preserve urls across slots. Tags act as an alias by creating a unqiue endpoint for each tag. This allows you to [migrate a consistent endpoint across slots](/cloud/resources/slots-and-tags/#zero-downtime-updates) with ease.

#### Will any of my endpoints change when this is released?

No. Every endpoint will remain unchanged.

#### Where should I send my feedback on the new system?

We're keen to hear from you. Come talk to us in the [SquidDevs Telegram channel](https://t.me/HydraDevs).

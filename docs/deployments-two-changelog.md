---
sidebar_class_name: hidden
---

# Deployments 2.0 - Сhangelog

Take a look at the [release notes](/deployments-two-release-notes) to better understand the motivation behind these changed, or at the [guide](/deployments-two-guide) to learn about some possible real-world workflows.

## Concepts

| Concepts                | Before                                    | After                                              |
|-------------------------|-------------------------------------------|----------------------------------------------------|
| Version                 | Existed                                   | Removed (replaced with slots)                      |
| Slot                    | Did not exist                             | Introduced (unique identifier for configs)         |
| Production alias        | Existed                                   | Deprecated (use tags)                              |
| Tag                     | Did not exist                             | Introduced (user-defined labels for deployments)   |
| Reference               | Existed                                   | Exists, but the format has changed                 |

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

Changes to CLI behavior are rather extensive:

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

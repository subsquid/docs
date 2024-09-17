---
sidebar_class_name: hidden
---

# Deployments 2.0 - Сhangelog

Deployments 2.0 simplify [the deployment process](/cloud/overview) with several key changes:

* **Slots:** Replace versions with unique deployment identifiers called slots. All distinct deployments with the same name and [organization](/cloud/resources/organizations) are assigned to distinct slots.
* **Tags:** Organize deployments with descriptive tags for better clarity. Each tag can be assigned to only one deployment among those that have the same name + organization. Multiple tags can be assigned to any one deployment.

## Before vs after

### Concepts

| Concepts                | Before                                    | After                                              |
|-------------------------|-------------------------------------------|----------------------------------------------------|
| Version                 | Existed                                   | Removed (replaced with slots)                      |
| Slot                    | Did not exist                             | Introduced (unique identifier for configs)         |
| Production alias        | Existed                                   | Deprecated (use tags)                              |
| Tag                     | Did not exist                             | Introduced (user-defined labels for deployments)   |
| Reference               | Existed                                   | Exists, but the format has changed                 |

### Format changes

| Value         | Before                                                  | After                                                 |
|---------------|---------------------------------------------------------|-------------------------------------------------------|
| Version       | Must be a number                                        | Deprecated                                            |
| Slot          | Did not exist                        | A string of up to six lower case alphanumeric characters, dashes allowed |
| Tag           | Did not exist                                   | A string of lowercase alphanumeric characters, dashes allowed |
| Reference     | `<name>@v<version>`                                     | `[<org>/]<name>(@<slot>\|:<tag>)`                     |
| Canonical URL | `https://<org>.squids.live/<name>/v/v<version>/graphql` | `https://<org>.squids.live/<name>@<slot>/api/graphql` |
| [Production URL](/cloud/resources/production-alias) | `https://<org>.squids.live/<name>/graphql` | Deprecated. See also [backwards compatibility](#backwards-compatibility). |
| Tag URL       | Did not exist                                           | `https://<org>.squids.live/<name>:<tag>/api/graphql`  |

### Manifest changes

| Field       | Before  | After                          |
|-------------|---------|--------------------------------|
| name        | Present | Present                        |
| version     | Present | Deprecated (mapped to slot)    |
| slot        | Absent  | New field (unique identifier)  |
| tag         | Absent  | New field (user-defined label) |

### CLI changes

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
| Updating a "dev" version                                | Was not possible                          | `sqd deploy . -t dev`                        |
| Fetching logs                                           | `sqd logs my-squid@v1`                    | `sqd logs -n my-squid -s v1`                 |

### Backwards compatibility

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

## Getting started with Deployments 2.0

**Prerequisites:**

1. Install the latest SQD CLI beta:

```bash
npm install -g @subsquid/cli@beta
```

2. Verify the installed version:

```bash
sqd --version
```

3. Enable preview on SQD Cloud https://app.subsquid.io/preview

**Deployment Process:**

1. **Create a new squid:** Follow the existing procedures.
2. **Deploy the squid:** Use `sqd deploy` to deploy your squid.
3. **Test deployment functionality:** Ensure everything works as expected using the canonical URL `https://<org>.squids.live/<name>@<slot>/api/graphql`.
4. **Organize your deployment(s):**
   - Use slots to control whether you deploy or redeploy. Deploying without specifying the slot always creates a new deployment, which is helpful in CI/CD setting.
   - Use tags to create URLs that persist across deployments. Reassign tags to switch between API versions with zero downtime.

## FAQ

#### Why use tags?

Tags create URLs that persist across deployments. Reassign tags to switch between API versions with zero downtime.

You can have multiple tags per squid name. This aids in organizing your deployments and in collaborative development.

#### How can I add a tag to my already existing squid?

Use the `sqd tags add` command:
```bash
sqd tags add tsttag -n my-squid -s v1
```

#### How can I assign a tag at the deployment time?

Use the `--add-tag` flag with `sqd deploy`. For example:

```bash
sqd deploy . --add-tag tsttag
```

This deploys a squid using the manifest from the local folder and adds the "tsttag" tag to the new deployment.

#### How can I create a new slot to my already existing squid?

Slots are automatically assigned to all new deployments that do not specify them explicitly (either in manifest or via `-s/--slot`). If you specify a slot and it doesn't exist, it'll be created; if it exists, the deployment in that slot will be updated.

#### I've been using the 'prod' command and it worked great! What's next?

You can [keep using the existing prod URLs](#backwards-compatibility) for your squids. We'll keep this feature up for a while, but ultimately you'll have to migrate to [tag-based URLs](#format-changes).

#### I want to add an old-style production URL to a deployment that does not have it. Is that possible?

For now, yes. Just assign a `prod` tag to it:
```bash
sqd tags add prod -n my-squid -s v1
```
See [Backwards compatibility](#backwards-compatibility) for details.

## Why did you make these changes?

[Take a look at release notes.](/deployments-two-release-notes)

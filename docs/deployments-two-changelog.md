---
sidebar_class_name: hidden
---

# Deployments 2.0 - Сhangelog

This page outlines SQD Cloud Deployments, a new and improved method for deploying and managing your Squids. 

Deployments 2.0 simplify [the process](/cloud/overview) with several key changes:

* **Slots:** Replace versions with unique identifiers called slots. 
* **Tags:** Organize deployments with descriptive tags for better clarity.

**Before vs. After**

| Feature                 | Before                                    | After                                         |
|-------------------------|-------------------------------------------|----------------------------------------------|
| Version concept         | Existed                                    | Removed (replaced with slots)                  |
| Slot concept             | Did not exist                               | Introduced (unique identifier for configs)     |
| Existing squids          | -                                          | Prefixed with "v" during migration (e.g., "v1") |
| Canonical URL format     | `https://subsquid.squids.live/my-squid/v/v1/graphql` | `https://subsquid.squids.live/my-squid@v1/api/graphql` |
| Production alias        | Existed                                    | Deprecated (use tags)                         |
| Tags                     | Did not exist                               | Introduced (user-defined labels for deployments) |

**Manifest and CLI Updates**

The manifest file and SQD CLI have been updated to reflect the new deployment approach. 

**Manifest Changes:**

| Field      | Before | After |
|-----------|--------|--------|
| manifestVersion | Present | Present |
| name        | Present | Present |
| version     | Present | Deprecated (mapped to slot) |
| slot        | Absent  | New field (unique identifier) |
| tag         | Absent  | New field (user-defined label) |

**CLI Changes:**

| Feature                                               | Before                                    | After                                         |
|---------------------------------------------------------|-------------------------------------------|----------------------------------------------|
| Deploying prod version                                 | `sqd deploy .`<br>`sqd prod my-squid@v1`     | `sqd deploy . --add-tag prod`                |
| Promoting to prod                                       | `sqd prod my-squid@v1`                       | `sqd tags add -n my-squid -s v1`              |
| Fetching logs                                          | `sqd logs my-squid@v1`                       | `sqd logs -n my-squid -s v1`                   |
| New flags                                               | NAMEVERSION argument                        | `--name`, `--tag`, `--slot`, `--reference`     |
| New commands                                            | N/A                                          | `tags add`, `tags remove`                    |
| Deprecated command                                      | `prod`                                       | N/A                                          |


### Getting Started with SQD Cloud Deployments

**Prerequisites:**

1. Install the latest SQD CLI beta:

```bash
npm install -g @subsquid/cli@beta
```

2. Verify the installed version:

```bash
sqd --version
```

3. Enable preview on SQD Cloud 

    https://app.subsquid.io/preview


**Deployment Process:**

1. **Create a New Squid:** Follow the existing procedures.
2. **Deploy the Squid:** Use `sqd deploy` to deploy your Squid directly.
3. **Test Deployment Functionality:** Ensure everything works as expected.
4. **Manage Slots and Tags (New):** Utilize slots and tags for advanced organization. 


### FAQs

***Q: What are Slots and Tags?***
* **Slots:** Unique environments within a Squid deployment, each with its own configuration and data.
* **Tags:** User-defined labels attached to specific slots for easier organization and identification.

***Q: Why Use Tags?***
* **Improved Organization:** Categorize Squids for better management.
* **Enhanced Collaboration:** Clearly define ownership and purpose of different versions.
* **Simplified Identification:** Use descriptive tags instead of complex identifiers.

***Q: How can I add a tag to my already existing squid?***
To add a tag to an existing Squid, use the `--add-tag` flag in the `sqd deploy` command. For example:

```bash
sqd deploy . -n evm-squid --add-tag test
```
This adds the "test" tag to the "evm-squid" Squid.

***Q: How can I create a new slot to my already existing squid?***
To create a new slot for an existing Squid, use the `-s` flag in the `sqd deploy` command, specifying the desired slot identifier. For example:

```bash
sqd deploy . -n evm-squid -s asmzf5
```
This creates a new slot with the identifier "asmzf5" for the "evm-squid" Squid.

**Q: I played around with the 'prod' command and it worked great! What's next?**

No worries, you can keep using the existing URLs for your Squid.  Think of tags like labels. Here's the good news: you can continue using the existing URLs for your Squid. To make things even smoother, you can add a "prod" tag to your current Squid. This won't change the URL format, which remains:

```
https://<org-code>-squids.subsquid.io/<squid-name>/graphql
```

This way, you have the added benefit of easily identifying your production environment with the "prod" tag and being able to assign more tags or using slots.

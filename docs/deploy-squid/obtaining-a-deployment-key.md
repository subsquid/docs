---
sidebar_position: 1
---

# Obtaining a deployment key

This short guide shows how to obtain a deployment key for a Squid in our Software as a Service webpage.

## First login

### Visit our website

In order to obtain a deployment key, it is necessary to visit our [website](https://app.subsquid.io) and login with your [GitHub](https://github.com) account, by clicking on **Sign In**

![Subsquid Saas homepage](</img/.gitbook/assets/app-home-page.png>)

### Create your Squid

Once logged in, a list of projects is presented. The first time it will be empty, so click on **Create squid** to start

![Squid projects list](</img/.gitbook/assets/app-empty-projects.png>)

Fill in the form to provide details for the project and click **Next**

![Squid creation form](</img/.gitbook/assets/app-create-squid-form.png>)

## On the Squid management page

### Deployment key

When either creating a new squid, or visiting its page afterwards, a set of instructions are listed on the page. The deployment key will be provided there.

![Create the first version for this project by following the indicated steps](</img/.gitbook/assets/app-deploy-squid.png>)

The command highlighted with a purple border is going to be used to authenticate the console window session with the **deployment key**.

```bash
sqd auth --key sqd_<deployment_key>
```

It will always be visible on this page, but be careful, because it will also remain visible in your terminal history.

To find out other important CLI commands for interacting with Aquarium are listed under the [dedicated subsection of complete CLI Reference](/docs/deploy-squid/squid-cli#subcommands-for-squid-command).

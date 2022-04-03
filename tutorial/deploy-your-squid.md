---
description: Launch a Squid node hosted in the Cloud by Subsquid
---

# Deploy your first Squid

Subsquid offers a _Software as a Service_ (SaaS) hosting, to further accelerate the development and reduce obstacles. This way, builders can focus on coding their business logic into the APIs, without having to worry about deployment and hosting.

The process is quite simple, but here's a step-by-step guide.

## Visit our website

Head over to [app.subsquid.io](https://app.subsquid.io) and login with your [GitHub](https://github.com) account, by clicking on **Sign In**

![Subsquid Saas homepage](<../.gitbook/assets/subsquid saas.png>)

## Create your Squid

Once logged in, a list of projects is presented. The first time it will be empty, so click on **Create squid** to start

![Squid projects list](<../.gitbook/assets/subsquid saas1.png>)

Fill in the form to provide details for the project and click **Next**

![Squid creation form](<../.gitbook/assets/subsquid saas2.png>)

## Deploy your code

It is possible to create multiple deployments of a Squid project, called `versions`. To begin, create your first version, by following the provided steps

![Create the first version for this project by following the indicated steps](<../.gitbook/assets/SquidSaas full.png>)

With a couple of notes and clarifications:

* It is actually better to fork or create a separate repository, rather than cloning the template. This will come in handy when developing and making changes
* The URL to the GitHub repository, as well as the branch needs to be provided for the last command, by substituting `<github url>` and `<github branch>` and the same goes with `<squid_version>`, which is the version name for this deployment. For example:\
  `sqd squid:release Test@one --source https://github.com/RaekwonIII/squid-template#main`

## Check the deployed Squid

As a result of the new release, a line will appear at the top of the page, with multiple fields:

* **version**: the name entered in the command for the deployment
* **endpoint**: the URL of the GraphiQL console for this query node
* **status**: for monitoring purposes.

![Squid management panel](../.gitbook/assets/SquidSaas.png)

A version can be edited or destroyed by accessing the actions next to the status.

Similarly, the Squid itself can be edited or deleted by accessing the actions next to the Squid name.

## Browse the Aquarium

When someone choses to have their Squid to be **publicly** hosted by us, it will become visible in the [Aquarium](https://app.subsquid.io/aquarium).

Visit and browse through interesting projects, created by our community!

## What's next?

To learn how to create a new version, modify the template, build custom APIs for any Substrate chain, take a look at the dedicated [Tutorial](../recipes/running-a-squid/generate-typescript-definitions.md).

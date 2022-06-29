---
description: Launch a Squid node hosted in the Cloud by Subsquid
---

# Deploy your first Squid

Subsquid offers a _Software as a Service_ (SaaS) hosting, to further accelerate the development and reduce obstacles. This way, builders can focus on coding their business logic into the APIs, without having to worry about deployment and hosting.

The process is quite simple, but here's a step-by-step guide.

## Visit our website

Head over to [app.subsquid.io](https://app.subsquid.io) and login with your [GitHub](https://github.com) account, by clicking on **Sign In**

![Subsquid Saas homepage](/img/.gitbook/assets/app-home-page.png)

## Create your Squid

Once logged in, a list of projects is presented. The first time it will be empty, so click on **Create squid** to start

![Squid projects list](/img/.gitbook/assets/app-empty-projects.png)

Fill in the form to provide details for the project and click **Next**

![Squid creation form](/img/.gitbook/assets/app-create-squid-form.png)

## Deploy your code

It is possible to create multiple deployments of a Squid project, called `versions`. To begin, create your first version, by following the provided steps

![Create the first version for this project by following the indicated steps](/img/.gitbook/assets/app-deploy-squid.png)

With a couple of notes and clarifications:

* It is actually better to fork or create a separate repository, rather than cloning the template. This will come in handy when developing and making changes
* The URL to the GitHub repository, as well as the branch needs to be provided for the last command, by substituting `<github url>` and `<github branch>` and the same goes with `<squid_version>`, which is the version name for this deployment. For example:\
  `sqd squid:release Test@latest --source https://github.com/RaekwonIII/squid-template#main`

## Check the deployed Squid

As a result of the new release, version card with following fields will appear at Squid page:

* **Source Code**: the name entered in the command for the deployment
* **Query URL**: the URL of the GraphiQL console for this query node
* **Status**: for monitoring purposes. Has "deploying" value at screenshot bellow

![Squid management panel](/img/.gitbook/assets/app-squid-created-deployed.png)

A version can be edited or destroyed by accessing the actions at top right corner of the card.

Similarly, the Squid itself can be edited or deleted by accessing the actions next at right top corner of Squid information block.

## Browse the Aquarium

When someone chooses to have their Squid to be **publicly** hosted by us, it will become visible in the [Aquarium](https://app.subsquid.io/aquarium).

Visit and browse through interesting projects, created by our community!

## What's next?

To learn how to create a new version, modify the template, build custom APIs for any Substrate chain, take a look at the dedicated [section](../develop-a-squid/substrate-support/typegen/README.md).

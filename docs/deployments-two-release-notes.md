---
sidebar_class_name: hidden
pagination_next: null
pagination_prev: null
---

# SQD Cloud deployments, now upgraded!

## What's new?

Over the last 6 months we've seen hundreds of teams deploy thousands of squids to [SQD Cloud](/cloud). Many of you have given us feedback that you'd like to see a more flexible and collaborative set of tools for your deployment flow. We hear you. We agree. So today we're introducing two new features:

* **Slots:** Forget incrementing a single version number! Versions will be retired and replaced by slots, a customisable identifier for each deployment.
* **Tags:** Remembering which squid is which just got a lot easier! Now you can create and assign multiple custom tags to any deployment. As a result we'll be retiring the [Production alias](/cloud/resources/production-alias) feature. Now tags act as aliases, making it possible to create, identify and consume endpoints.

[I’ll read the story later, let me see what I can do with it!](/cloud/resources/slots-and-tags)

![](https://github.com/user-attachments/assets/c32acb2f-51be-4047-b817-277eb8fe7eda)

## Why the change?

When we initially built the original deployment flow versions felt appropriate. A simple number you could increment on each deployment if necessary. This worked well in simple scenarios, but over time this gradually became more difficult to manage for those of you with any kind of deployment complexity.

At the same time it became clear that our solution to endpoint management, allowing you to mark a squid as production and create a permalink, was equally powerful in basic scenarios but limited as requirements grew.

It became clear that was lacking here was the ability for larger teams to collaborate effectively. Our goal with these changes is to provide the power and flexibility that more complex deployment flows need.

## How does it work?

Let's take an example, we want to create and test a squid, and then over time gradually promote it to production.

In our old workflow we can either keep redeploying over our v1 squid as we develop or eventually deploy v2 and v3 etc, which could be confusing as they may not be actually better! This means we need to spend time manually tracking what each version contains. Not ideal!

Now let's walk through our new workflow with a common example!

Let's start with the first developer on the team deploying a squid called `ethprice` into a slot of our choosing `4f5sfc`. Here's the (shortened) manifest file they configure:

```bash
...
name: ethprice
slot: 4f5sfc
...
```

And now deploying it to the cloud:

```bash
sqd deploy .
```

Next, let's imagine they tag the cloud deployment as `test`.

```bash
sqd tags add test -n ethprice -s 4f5sfc
```

Finally, we might imagine a second developer comes along and redeploys the squid to a new slot tagging it as `staging`.

```bash
sqd deploy . -s 6x5efr --add-tag staging
```

If the team then took a look at SQD cloud they'd see:

![image](https://gist.github.com/user-attachments/assets/35fbee5a-b6fb-49f8-805a-4d91a7820fab)

At a glance they can see what each deployment contains and the stage of development is at.

The tagging system can be used for any custom workflow that your team needs. We can't wait to see how you use it!

## FAQs

#### How do I get full access to the new features?

Just update your Squid CLI to `>=3.0.0`. It's in `@latest`:

```bash
npm install -g @subsquid/cli@latest
```

#### Do I need to redeploy anything?

No. But we suggest you take a look at the [Backwards compatibility](/cloud/reference/deployments-two-changelog/#backwards-compatibility) section in our changelog.

#### We really like versions, they work well for us, do we need to change our workflow?

No, you don't need to change your workflow at all! Your version will be migrated into the new slot field, and slots are a just an arbitrary string between 2 and 6 characters in length. Our goal was to expand functionality rather than remove it.

#### Do I need to use tags?

No, they are completely optional, and purely to identify and alias the squids endpoint. Each deployment can always be consumed from it's immutable endpoint, which is based on it's slot. 

#### Why should I use tags? Convince me.

Tags serve two key roles. Firstly as a labelling mechanism, this allows teams to explicitly describe what each squid does and what stage it's at in development. Secondly as a way to preserve urls across slots. Tags act as an alias by creating a unqiue endpoint for each tag. This allows you to migrate a consistent endpoint across slots with ease.

#### Did any of my endpoints change on this release?

No. Every endpoint remains unchanged.

#### Where can I learn more about these updates?

Learn how to use these new features [here](/cloud/resources/slots-and-tags).

To read about the indepth details of the changes please head [here](/cloud/reference/deployments-two-changelog).

We'd love to hear your feedback on these changes. Tag us on twitter [@helloSQD](https://x.com/helloSQD) or come talk to us in [Telegram](https://t.me/HydraDevs).

---
description: With and without resetting the database
---

# Updating a Squid

After having created and deployed a Squid, it is possible to make improvements, changes, add new functionalities. For this reasons, it is sometimes necessary to update a Squid and make sure it is running on the latest code.

## Authentication

In order to accomplish the tasks below, the terminal window in which the commands are being launched, needs to be authenticated. To do so, refer to the Recipe on [how to obtain a deployment key](obtaining-a-deployment-key.md), and launch the authentication command:

```bash
sqd auth --key sqd_<auht_code>
```

## Redeploy the same version

If, for example, we have made changes to our project and we want to trigger a new release, while maintaining the same version and, consequently, the same endpoint, the `update` subcommand is going to do just that. It will suffice to give all these variables the right values:

* `squid_name`
* `squid_version`
* `github url`
* `github branch`

To visualize this, let's take an example used previously:

![A deployed Squid](../../.gitbook/assets/SquidSaas.png)

In this case, the command to trigger a new release of the same version would be:

```bash
sqd squid:update SquidSaas@1 --source <github url>#<github branch>
```

Where the GitHub variables depend on the project itself.

{% hint style="info" %}
In case the release needs a database reset, the `--hardReset` option can be added to the previous command.&#x20;
{% endhint %}

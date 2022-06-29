# Maintaining multiple versions

At times, it may be useful to deploy multiple versions of the same Squid. For example, to test an advanced feature or to maintain retro-compatibility, following legacy-breaking changes.

## Authentication

In order to accomplish the tasks below, the terminal window in which the commands are being launched, needs to be authenticated. To do so, refer to the Recipe on [how to obtain a deployment key](/docs/deploy-squid/obtaining-a-deployment-key), and launch the authentication command:

```bash
sqd auth --key sqd_<auth_code>
```

## Redeploy the same version

If, for example, we have made changes to our project, and we want to trigger a new release, while maintaining the same version and, consequently, the same endpoint, the `update` subcommand is going to do just that. It will suffice to give all these variables the right values:

* `squid_name`
* `squid_version`
* `github url`
* `github branch`

To visualize this, let's take an example used previously:

![A deployed Squid](/img/.gitbook/assets/app-squid-created-deployed.png)

In this case, the command to trigger a new release of the same version would be:

```bash
sqd squid:update SquidSaas@1 --source <github url>#<github branch>
```

Where the GitHub variables depend on the project itself.

:::info
In case the release needs a database reset, the `--hardReset` option can be added to the previous command.&#x20;
:::

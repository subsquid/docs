# Releasing a Squid version

## Deploy your code

Once the [preliminary steps](obtaining-a-deployment-key.md) are covered and we have obtained a deployment key and authenticated the terminal session, it is possible to effectively launch our API by deploying our code as a Squid.

It is possible to create multiple deployments of a Squid project, called `versions`. The instructions on the Squid page report the last&#x20;

![Create the first version for this project by following the indicated steps](<../../.gitbook/assets/SquidSaas full\_release.png>)

The highlighted command will allow you to release a new version, provided the correct values are given for the placeholder variables:

* `squid_version`
* `github url`
* `github branch`

## Check the deployed Squid

As a result of the new release, a line will appear at the top of the page, with multiple fields:

* **version**: the name entered in the command for the deployment
* **endpoint**: the URL of the GraphiQL console for this query node
* **status**: for monitoring purposes.

![Squid management panel](../../.gitbook/assets/SquidSaas.png)

A version can be edited or destroyed by accessing the actions next to the status.

Similarly, the Squid itself can be edited or deleted by accessing the actions next to the Squid name.

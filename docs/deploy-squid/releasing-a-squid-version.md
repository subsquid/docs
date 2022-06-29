# Releasing a Squid version

## Deploy your code

Once the [preliminary steps](/docs/deploy-squid/obtaining-a-deployment-key) are covered and we have obtained a deployment key and authenticated the terminal session, it is possible to effectively launch our API by deploying our code as a Squid.

It is possible to create multiple deployments of a Squid project, called `versions`. The instructions on the Squid page report the last&#x20;

![Create the first version for this project by following the indicated steps](</img/.gitbook/assets/app-deploy-squid-highlighted.jpeg>)

The highlighted command will allow you to release a new version, provided the correct values are given for the placeholder variables:

* `squid_version`
* `github url`
* `github branch`

## Check the deployed Squid

As a result of the new release, a line will appear at the top of the page, with multiple fields:

As a result of the new release, version card with following fields will appear at Squid page:

* **Source Code**: the name entered in the command for the deployment
* **Query URL**: the URL of the GraphiQL console for this query node
* **Status**: for monitoring purposes. Has "deploying" value at screenshot bellow

![Squid management panel](/img/.gitbook/assets/app-squid-created-deployed.png)

A version can be edited or destroyed by accessing the actions at top right corner of the card.

Similarly, the Squid itself can be edited or deleted by accessing the actions next at right top corner of Squid information block.

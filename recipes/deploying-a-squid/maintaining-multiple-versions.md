# Maintaining multiple versions

At times, it may be useful to deploy multiple versions of the same Squid. For example, to test an advanced feature or to maintain retro-compatibility, following legacy-breaking changes.

## Authentication

In order to accomplish the tasks below, the terminal window in which the commands are being launched, needs to be authenticated. To do so, refer to the Recipe on [how to obtain a deployment key](obtaining-a-deployment-key.md), and launch the authentication command:

```bash
sqd auth --key sqd_<auht_code>
```

## Deploy a new version

Deploying a new version is as easy as using the same command as releasing the first version, only difference is that, by changing the `squid_version`, a new version will be created. If we take the example used in previous pages, the following command:

```bash
sqd squid:release SquidSaas@2 --source <github url>#<github branch>
```

Will result in a new line being added to Squid web page:

![Multiple versions of the same Squid](../../.gitbook/assets/SquidSaas\_v2.png)

## Listing version on the command line

To keep track of which Squids are available and which versions of a Squid are deployed, without consulting the webpage every time, you can use the `ls` command. This will list all Squids deployed for the account linked to the deployment key used to authenticate:

```bash
⇒ sqd squid ls
 Name      Description 
 ───────── ─────────── 
 SquidSaas null   
```

And when using it with the `-n` parameter to specify the Squid name, it can be used to list all its versions:

```bash
⇒ sqd squid ls -n SquidSaass
 version name artifactUrl                                           deploymentUrl                                       Status  Created at 
 ──────────── ───────────────────────────────────────────────────── ─────────────────────────────────────────────────── ─────── ────────── 
 1            https://github.com/<account>/squid-template.git#main https://app.gc.subsquid.io/beta/squidsaas/1/graphql SYNCING 1645701248 
 2            https://github.com/<account>/squid-template.git#main https://app.gc.subsquid.io/beta/squidsaas/2/graphql SYNCING 1645710152 
```


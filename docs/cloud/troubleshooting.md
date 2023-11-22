---
sidebar_position: 115
---

# Common Aquarium issues

### `Secrets outdated. Please restart the squid` notification in Aquarium

This occurs when you have a squid deployed, then create, remove or change some [environment variables](/squid-cli/secrets) of [relevance](/deploy-squid/organizations). Squids must be restarted manually for such changes to have effect. Navigate to the squid version page (e.g. by clicking on the warning sign) and click restart. The restart will not touch the database, so unless your new secret values cause the squid to crash this procedure should be quick and easy.

![Secrets outdated](</img/secrets-outdated.png>)

### My squid is stuck in "Building", "Deploying" or "Starting" state

- Run with `SQD_DEBUG=*` as explained on the [Logging](/basics/logging/#overriding-the-log-level) page
- Update the squid CLI to the latest version with
```bash
npm update -g @subsquid/cli
```
- Update the Squid SDK dependencies:
```bash
npm run update
```
- Check that the squid adheres to the expected [structure](/basics/squid-structure)
- Make sure you can [build and run Docker images locally](/deploy-squid/self-hosting)

### `Validation error` when releasing a squid

Make sure the squid name contains only alphanumeric characters, underscores and hyphens. The squid version must be also alphanumeric. 
Since both the squid and version name become part of the squid API endpoint URL, slashes and dots are not accepted. 

### My squid ran out of disk space

Get in contact with the [Squid Squad](https://t.me/SquidDevs) and request extra resources. 

### I have exceeded the limit of squid versions

Get in contact with the [Squid Squad](https://t.me/SquidDevs) to get a Premium tier.

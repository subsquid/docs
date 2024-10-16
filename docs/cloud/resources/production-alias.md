---
sidebar_class_name: hidden
---

:::danger
Production aliasing feature is deprecated in `@subsquid/cli>=3.0.0`. Use [Slots and tags](/cloud/resources/slots-and-tags) instead.
:::

# Alias to the production endpoint

Version aliasing is used to switch between squid versions without a downtime and updates of the downstream clients. 
Each squid has a canonical production endpoint URL of the form
```bash
https://<org name>.subsquid.io/<squid name>/graphql
```

To alias a squid version to the production endpoint, use [`sqd prod`](/squid-cli/prod):
```bash
sqd prod <squid name>@<version>
```

Note that after promoting to the production the version-specific endpoint URL of the form
```bash
https://<org name>.subsquid.io/<squid name>/v/v<version>/graphql
```
remains to be available.


## Example

Assuming your organization is called `my-org`, running

```bash
sqd prod my-squid@v1
```

will make the endpoint of the v1 of `my-squid` accessible at `https://my-org.subsquid.io/my-squid/graphql`.

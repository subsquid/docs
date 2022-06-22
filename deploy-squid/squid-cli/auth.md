# auth

The `auth` command of the `sqd` command line interface is used to authorize the current terminal session to interact with the Squid SaaS hosted solution.

This is necessary to make sure that only the holder of the deployment key, obtained on the web app, is able to manage the project that are and will be deployed there.

### Options for `auth` command

| Argument         | Description                                            | Required |
| ---------------- | ------------------------------------------------------ | -------- |
| `-k` or `--key=` | A deployment key has to be provided after the argument | Yes      |

## Example

```bash
sqd auth --key sqd_a7e6c5fa14d2c5f50023
```

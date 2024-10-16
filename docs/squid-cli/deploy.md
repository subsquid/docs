`sqd deploy`
============

Deploy new or update an existing squid deployment in the Cloud. Squid name and also optionally slot and/or tag are taken from the provided deployment manifest.

* [`sqd deploy SOURCE`](#sqd-deploy-source)

## `sqd deploy SOURCE`

Deploy new or update an existing squid in the Cloud

```
USAGE
  $ sqd deploy SOURCE [--interactive]
    [-r [<org>/]<name>(@<slot>|:<tag>) | -o <code> | -n <name> | [-s <slot>] | [-t <tag>]]
    [-m <manifest_path>] [--hard-reset] [--stream-logs] [--add-tag <value>]
    [--allow-update] [--allow-tag-reassign] [--allow-manifest-override]

ARGUMENTS
  SOURCE  [default: .] Squid source. Could be:
          - a relative or absolute path to a local folder (e.g. ".")
          - a URL to a .tar.gz archive
          - a github URL to a git repo with a branch or commit tag

FLAGS
  -m, --manifest=<manifest_path>  [default: squid.yaml] Specify the relative local path
                                  to a squid manifest file in the squid working directory
      --add-tag=<value>           Add a tag to the deployed squid
      --allow-manifest-override   Allow overriding the manifest during deployment
      --allow-tag-reassign        Allow reassigning an existing tag
      --allow-update              Allow updating an existing squid
      --hard-reset                Perform a hard reset before deploying. This will drop
                                  and re-create all squid resources, including the
                                  database, causing a short API downtime
      --[no-]interactive          Disable interactive mode
      --[no-]stream-logs          Attach and stream squid logs after the deployment

SQUID FLAGS
  -n, --name=<name>                               Name of the squid
  -r, --reference=[<org>/]<name>(@<slot>|:<tag>)  Fully qualified reference of the squid.
                                                  It can include the organization, name,
                                                  slot, or tag
  -s, --slot=<slot>                               Slot of the squid
  -t, --tag=<tag>                                 Tag of the squid

ORG FLAGS
  -o, --org=<code>  Code of the organization

DESCRIPTION
  Deploy new or update an existing squid in the Cloud

EXAMPLES

  // Create a new squid with name provided in the manifest file
  $ sqd deploy .

  // Create a new squid deployment and override it's name to "my-squid-override"
  $ sqd deploy . -n my-squid-override

  // Update the "my-squid" squid with slot "asmzf5"
  $ sqd deploy . -n my-squid -s asmzf5

  // Use a manifest file located in ./path-to-the-squid/squid.prod.yaml
  $ sqd deploy ./path-to-the-squid -m squid.prod.yaml

  // Full paths are also fine
  $ sqd deploy /Users/dev/path-to-the-squid -m /Users/dev/path-to-the-squid/squid.prod.yaml
```

_See code: [src/commands/deploy.ts](https://github.com/subsquid/squid-cli/tree/master/src/commands/deploy.ts)_

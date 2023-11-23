A collection of scripts for handling page migrations using path correspondences files, that is, movement logs in the following format:
```
deploy-squid/deploy-manifest.mdx -> cloud/reference/manifest.mdx
deploy-squid/self-hosting.md -> sdk/resources/self-hosting.md
deploy-squid/troubleshooting.md -> cloud/troubleshooting.md
deploy-squid -> cloud
```

**Dependencies**: [jq](https://jqlang.github.io/jq/)

**Limitations**: Redirects rewriting scripts do not check for source file/dir existence, so occasionally their edits cause
```
The redirect plugin is not supposed to override existing files
```
errors. These can be debugged manually by running `npm run build` and removing the offending redirects until the issue disappears.

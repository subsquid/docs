# Contributing to Hydra

Hydra is an open-source project and contributions in the form of a PR are welcome. We use [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/) enforced by the [commitizen](https://github.com/commitizen) and [commitlint](https://commitlint.js.org/#/)

## Testing

A pull request adding a new feature or fixing an existing bug should include a test covering the changes. The contribution can be covered either by an e2e test or by  a unit test. End-to-end tests are located in `packages/hydra-e2e-tests` and can be run from the root with `yarn e2e-test`. Unit tests are package-specific. For example, unit tests for `hydra-cli` can ber run using `yarn workspace @subsquid/hydra-cli test`. Both e2e and unit tests are run by CI once a PR is opened.

## Versioning and Releases

The monorepo is organized with lerna, with a single version for all packages. Once a pull request is merged, the version is bumped to the new pre-release version following the conventional commits convention. When deemed mature, the `publish` action can be manuually triggered. It graduates the pre-release version and publishes to the npm registry and docker hub (for private packages `hydra-indexer` and `hydra-indexer-gateway`).

## Publishing (for maintainers only)

`Publish` Github action is supposed to be run manually. It has the following inputs:

- `packages`: specify the list of packages to publish. If the list containts `hydra-indexer` and/or `hydra-indexer-gateway` then the corresponding Docker images will be published to Dockerhub. By default, it is set to `'*'` which means that both npm packages and Docker images will be published

- `graduate`: Whether the current pre-release should be [graduated](https://github.com/lerna/lerna/blob/main/commands/version/README.md#--conventional-graduate) by Lerna. For examaple, `2.0.1-alpha.3` will be graduated to `2.0.1`. Graduated releases are published with the `latest` tag, while `pre-releases` has `next`.

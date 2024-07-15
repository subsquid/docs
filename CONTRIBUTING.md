# Contributing to SQD documentation

**Pre-requisites:** NodeJS v18 or newer

SQD documentation is made with [Docusaurus](https://docusaurus.io).

Begin by cloning the repo, installing the deps and starting the development server:
```bash
git clone https://github.com/subsquid/docs
cd docs
npm ci
npm run start
```
The last command should open the dev version of the docs in your browser; if it doesn't, try visiting [localhost:3000](http://localhost:3000).

## Making edits

The general procedure is straightforward: make edits, observe the changes as they are rendered by the dev server, commit and make a PR. The two extra things to keep in mind are:
 - following the style, and
 - running certain checks before committing.

### Style

Almost all style conventions of this repo are there to make any future page reshufflings less painful.

1. Use absolute paths in internal references, e.g.
   ```markdown
   For real time data you can use the [`rpc` addon](/cloud/resources/rpc-proxy).
   ```

   The only situations when relative references are appropriate occur when it's a virtual certainty that if and when the elements are moved somewhere else, they are moved together. For example, pages for `addLog()` and `addTransaction()` methods of `EvmBatchProcessor` are very unlikely to ever end up in different folders, so it's OK to do things like
   ```markdown
   Note that logs can also be requested by [`addTransaction()`](../transactions) ...
   ```
   on the logs page.

   You should also use relative links to refer to the images sitting in the same folder (see below). 

2. If you're using images in a markdown file, put them in the subfolder of `./docs` where your file resides, not in `./static/img`. Prefix image file names with the base name of the markdown file, e.g.
   ```
   ./docs/cloud/overview.md
   ./docs/cloud/overview-rpc-page.png
   ./docs/cloud/overview-deploy2.png
   ...
   ```

   In markdown, refer to them by their relative paths:
   ```markdown
   ![RPC proxy tab](./overview-rpc-page.png)
   ```

3. Indent code examples with two spaces whenever possible. Exceptions can be made when indenting the code that way can impair readability for a noticeable fraction of users, e.g. in Python code.

### Run the pre-flight checks

1. If you move any pages around, make sure you have added any appropriate redirects to `./redirectRules.js`.

2. Verify that
   ```bash
   npm run build
   ```
   completes without printing any errors _or warnings_. The most important effect of this is that you'll avoid adding any internal dead links.

> [!TIP]
> If you're looking to contribute, a PR with a simple script that checks HTTP status of all external links would be much appreciated.

3. Verify that the path slugs in all `_category_.json` files are correct. There's a script for that:
   ```bash
   ./scripts/checkAllCategorySlugs.sh
   ```

4. If you edited anything besides plain markdown, verify that your edits are rendered as expected in
   - any recent version of Chrome, desktop resolution
   - any recent version of Chrome, phone resolution
   - any recent version of Firefox, desktop resolution
   - if possible, please also check Safari

### Sending the edits

**If you are from the SQD team,** please push your changes into a branch of the `subsquid/docs` repo. Ask Anton Bernatskiy for permissions if you don't have them.

**If you are not from the SQD team,** just make a fork and issue PR requests normally.

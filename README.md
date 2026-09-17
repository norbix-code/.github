# norbix-code/.github

Default [community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
for the `norbix-code` organization.

GitHub shows these files on every repository in the organization that does not
have its own copy:

- [`SECURITY.md`](SECURITY.md) — supported versions and how to report a
  vulnerability in the Norbix SDKs and CLI.

## Keeping the security table current

The **Supported Versions** table in `SECURITY.md` is generated, so don't edit it
by hand:

- `scripts/security-packages.json` lists the packages (name, repository,
  registry and where to look up the latest version). Add a new SDK here.
- `scripts/update-security-table.mjs` looks up each package's latest stable
  release and rewrites the table between the `security-table` markers. Run it
  locally with `node scripts/update-security-table.mjs` (Node 22+), or with
  `--check` to see whether it is out of date.
- The **Update security table** workflow runs it every Monday and on demand
  (Actions → Update security table → Run workflow). When the table changed —
  a new major version, a first release, or a manifest change — it pushes the
  regenerated file to `automation/security-table`. The organization does not
  let GitHub Actions create pull requests, so it opens (or updates) an issue
  with the changed rows and a one-click link to create the pull request.

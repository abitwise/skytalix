# Versioning

skytalix uses [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`, for example
`1.0.0`.

## Which number goes up

- **MAJOR**: a change that breaks an existing user. For example: a UCI option is removed or
  renamed, or its meaning changes; a CLI command or flag changes or is removed; older saved games
  no longer load; the minimum Node.js major version goes up.
- **MINOR**: the engine plays differently or gains a feature. For example: a search or
  evaluation change; a level is added or retuned; a new UCI option, CLI flag or launcher.
- **PATCH**: fixes and docs that do not change how the engine plays.

## Where the version lives

The version is written in one place: `"version"` in `package.json`. `npm run chess -- --version`
and `bin/skytalix-uci --version` print it, for example `skytalix 1.0.0`.

The UCI `id name` stays `skytalix`, without a version. This may be looked at again at a future
major version.

## Releases

Each release is:

- an annotated tag `vX.Y.Z` on `main`, and
- a GitHub Release page whose notes are that version's entry in [CHANGELOG.md](CHANGELOG.md).

A strength figure goes into the release notes only when a measured reading backs it.

Who does what: the orchestrator creates the tag locally after QE passes. The owner pushes the
tag and publishes the Release page.

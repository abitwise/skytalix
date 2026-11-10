---
id: 20261110T134436Z-orchestrator-decision-09ef1fca
kind: decision
by: orchestrator
at: 2026-11-10T13:44:36Z
verified_by: 
confidence: high
refs:
  - package.json
  - src/uci.ts
  - src/cli.ts
  - src/cli-options.ts
  - README.md
  - VERSIONING.md
  - CHANGELOG.md
supersedes: 
seal: sha256:5da5a236a7e74ac83d92ef798ba4f09eb9094dd0596b25c8f5e6052f984d4eb6
---

Owner, 2026-11-10: "create versioning for skytalix, save the versioning rules … after everything create version v1.0 and tag." On the proposal he answered: "1. no [no version in the UCI id name, for now] ; 2. yes [a --version command] ; 3. tag + release page ; 4. ok, let's use v1.0.0". This is cut as ABC-315 by this note. Acceptance:

- **A1, VERSIONING.md** (new, repo root), plain short English, the rules as proposed and accepted: Semantic Versioning MAJOR.MINOR.PATCH. MAJOR: a change that breaks an existing user — a UCI option removed or renamed or its meaning changed, a CLI command or flag changed or removed, older saved games no longer loading, a higher minimum Node.js major. MINOR: the engine plays differently or gains a feature — search or evaluation changes, a level added or retuned, a new UCI option, CLI flag or launcher. PATCH: fixes and docs that do not change how the engine plays. The version lives in package.json; each release is an annotated tag `vX.Y.Z` on main and a GitHub Release page whose notes are that version's CHANGELOG.md entry; a strength figure goes into release notes only when a measured reading backs it. Who: the orchestrator tags locally after QE passes; the owner pushes the tag and publishes the Release page. The UCI `id name` stays `skytalix` without a version (owner's choice; may be revisited at a future major).
- **A2, CHANGELOG.md** (new): Keep-a-Changelog style headings; one entry, `## [1.0.0] - 2026-11-10`, a short factual summary of what 1.0.0 is, taken only from the current README (terminal play; seven levels with their times and blunder rates; UCI with Skill Level, OwnBook, TimeMode; built-in opening book; saved games; launchers for macOS/Linux and Windows, which states are tested as README says; the measured strength 1 902.5 ± 49.1 at 100 ms per move vs Stockfish 19, exactly as README's Strength section words it, with its conditions). No unmeasured claim.
- **A3, version 1.0.0**: package.json "version" 1.0.0, and package-lock.json's matching fields (via `npm version 1.0.0 --no-git-tag-version` or equivalent; no tag by SE). "private": true stays.
- **A4, --version**: `--version` as the ONLY argument prints `skytalix 1.0.0` (the package.json version, read at runtime — one source of truth, no hard-coded copy, working both from src/ via `npm run chess -- --version` and from the built dist/uci.js, i.e. `bin/skytalix-uci --version`) to stdout and exits 0. Both entry points: src/cli.ts (via cli-options) and src/uci.ts (whose "takes no arguments" usage stays for every other argument). `--version` combined with other arguments is a usage error, as any unknown combination is today. UCI mode without arguments is byte-for-byte unchanged (the `id name skytalix` line included). Tests cover both entry points; existing tests stay green.
- **A5, README**: a short line on `--version` where the README describes commands, and a link to VERSIONING.md and CHANGELOG.md (e.g. in Development or a small Versioning section). No other README change; art cmp passes.
- **A6, checks**: typecheck, lint, build, and the full test suite pass, each run alone under the host lock; `printf 'uci\nquit\n' | bin/skytalix-uci` is unchanged; diff limited to the files above plus tests and records; paths stay out of records.

QE checks it, and QE's verdict signs UAT. After merge the orchestrator creates annotated tag v1.0.0 on main locally; the owner pushes it and publishes the Release page with the CHANGELOG 1.0.0 entry.

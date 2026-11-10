---
id: 20261110T135244Z-software-engineer-observation-d561adba
kind: observation
by: software-engineer
at: 2026-11-10T13:52:44Z
verified_by: 
confidence: high: every check above was run by SE after the last code edit
refs:
  - se-ABC-315
  - ABC-315
  - grugops/ABC-315
  - 278a536c
  - package.json
  - src/version-file.ts
  - src/cli-options.ts
  - src/cli.ts
  - src/uci.ts
  - src/cli.test.ts
  - src/version.test.ts
  - VERSIONING.md
  - CHANGELOG.md
  - README.md
  - orch-2026-10-30a/20261110T134436Z-orchestrator-decision-09ef1fca
supersedes: 
seal: sha256:1b52b4725f6c0702eee14682b816a2d2f7d4adc427aff72f4f37d44262374945
---

# se-ABC-315 observation: version 1.0.0, --version on both entry points, VERSIONING.md, CHANGELOG.md

Branch grugops/ABC-315 from main c57c17bb; implementation commit 278a536c. Spec: orch-2026-10-30a/20261110T134436Z-orchestrator-decision-09ef1fca (A1-A6).

What changed:
- A1 VERSIONING.md: the SemVer rules as the decision note words them; where the version lives; tag and Release page; who tags and who pushes; id name stays skytalix.
- A2 CHANGELOG.md: Keep-a-Changelog; one entry, [1.0.0] - 2026-11-10, drawn from README only (play options, seven levels with times and blunder rates, UCI options, opening book, saved games, launchers with their tested states, --version, and the Strength section's figure with its conditions). Projected strengths left out: they are not measured.
- A3 package.json and package-lock.json at 1.0.0 via npm version 1.0.0 --no-git-tag-version --ignore-scripts. No tag. private stays true.
- A4 how the version is read: src/version-file.ts, a holder in book-file.ts's shape, reads new URL("../package.json", import.meta.url) when asked and returns "<name> <version>". ../package.json is the repo root from src/ and from dist/, so both npm run chess and bin/skytalix-uci read the same file. src/cli-options.ts accepts --version only as the whole command line (Resolution's ok arm gains version: boolean beside absent); with any other argument it is the usage error "--version cannot be used with other arguments". src/cli.ts writes the line on sink after the EPIPE arm and returns, exit 0. src/uci.ts: --version alone writes the line and returns, with its own EPIPE arm (without one, node src/uci.ts --version | true crashed with an unhandled EPIPE, measured); every other argument keeps the old usage line, unchanged.
- A5 README: one line on --version under Play; a link to VERSIONING.md and CHANGELOG.md under Development.
- Tests: src/cli.test.ts resolver rows (table, accepted spellings, near-miss family 168 cases over 163 distinct, a --version row) at zero spawns; src/version.test.ts: the holder in process, then three children (cli --version, uci --version, uci --version --version) in the src/uci.real-engine.test.ts form.

Beyond the spec, and why:
- The cli usage line gains [--version], and AGENTS.md's Dev / run slot lists --version: existing guards (ABC-065 A3, ABC-066 A1-A3) require every accepted argument in both. Two pins re-pinned with their reason: ABC-212 A7's byte-exact usage line, and ABC-044 A6's sink.write count (2 to 3). Receipt added in memory-bank/90-agents-md-command-log.md.
- Three new default-lane children in src/version.test.ts; src/cli.test.ts's N8_SPAWN pin (28) is unchanged. Cost not measured.
- src/version-file.ts is a new capability holder (ADR-0036 limb 1): Security/NFR may want to see it.

Checks, each alone under flock on the host test lock, after the last code edit:
- npm run typecheck: exit 0.
- npm run lint: exit 0, 150 files, no fixes.
- npm run build: exit 0; dist/version-file.js emitted.
- npm test: 72 files, 2739 passed, 0 failed, 0 skipped.
- printf 'uci\nisready\nquit\n' | bin/skytalix-uci: stdout (251 bytes) and stderr (0 bytes) cmp-identical to a build of main c57c17bb; printf 'uci\nquit\n' also identical. id name skytalix.
- bin/skytalix-uci --version and npm run chess -- --version: skytalix 1.0.0, exit 0; also from another cwd. bin/skytalix-uci --version extra: usage, exit 1.
- README art block cmp assets/readme-art.txt: exit 0.
- records-path-check --base main --head grugops/ABC-315: run after this note is committed.

Not checked: the Windows launcher with --version; GitHub's render of CHANGELOG.md; the three new children's lane cost. UNKNOWN - verify.

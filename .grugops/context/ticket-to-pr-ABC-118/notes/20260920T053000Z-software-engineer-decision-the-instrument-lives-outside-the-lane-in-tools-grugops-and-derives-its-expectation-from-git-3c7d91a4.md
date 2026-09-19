---
id: 20260920T053000Z-software-engineer-decision-the-instrument-lives-outside-the-lane-in-tools-grugops-and-derives-its-expectation-from-git-3c7d91a4
kind: decision
by: software-engineer
at: 2026-09-20T05:30:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - ABC-050
  - tools/grugops/lane-inventory.js
  - vitest.config.ts
  - NFR-008
supersedes:
---

# `ABC-118` `A4` — the placement ruling: OUT of the lane, in `tools/grugops/`, expectation derived from git

**Hand-authored `decision`. `context.human_admission` is `off`; no `finding` is admissible and this
carries no stamp.** Argued here because the ticket's `## The placement question` makes the ruling
a deliverable and refuses to let the obvious placement ship unexamined.

## What was built

`tools/grugops/lane-inventory.js`, 93 lines, `node:` builtins only, run as
`node tools/grugops/lane-inventory.js` from anywhere inside the checkout. It compares two sets:

- **collected** — `node node_modules/vitest/vitest.mjs list --filesOnly` at the repository root.
  The ROOT form on purpose: `npm test` is `vitest run` at the root, and the root form is the one
  a `.claude/**` typo inflates. `--dir src` would never see the inflation.
- **tracked** — `git ls-files -z -- '*.test.ts'` at the same root. Every tracked `*.test.ts` in
  this repository is under `src/` (42 of 42, checked), so the two sets are the same shape.

Exit 0 when equal; exit 1 naming every path on either side (paths only, never contents — the
tree vitest lists includes git-ignored agent worktrees, the ticket's ASVS note); exit 2 when git
or vitest could not run, so "could not look" is distinguishable from "looked and found nothing".
The contract is `test-skip-integrity.js`'s, which sits beside it.

## How it stays true with no hard-coded count (the subtask's question)

The recorded expectation is the **git index**, never a number on a page. A merge that brings
`src/quiescence.test.ts` (`ABC-079`, unmerged today) brings it into both sets in one commit, so
the instrument cannot go stale on a merge. A new `*.test.ts` that is on disk but not `git add`ed
is collected-but-untracked and reds the check until it is added or deleted (`A3`, watched in the
mutants note); the commit that adds it is the stated reason. **This reads `A3`'s "recorded
expectation" as the index and "the stated reason" as the commit** — the ticket's literal shape
(a count someone edits) is the one the Orchestrator's subtask ruled out as going stale on the
next merge, and I took the subtask's later instruction over the page's earlier wording. Said
here so nobody has to guess which was chosen.

## Why not in the lane — three grounds, two measured

1. **A guard in the lane is removable by the defect it guards.** BA/PM measured at the cut that
   excluding a not-yet-existing `**/lane-inventory.test.ts` moves the collected count by nothing.
   A `.js` under `tools/` is not collected by vitest, so no `test.exclude` entry reaches it —
   **`M4` in the mutants note plants `"**/tools/**"` and `"**/lane-inventory*"` and the
   instrument still runs and still reads 42/42.** That hole is closed for THIS placement by
   construction, not by a mechanism.
2. **A new lane file cannot fit `A6`.** The subtask names the ~370 ms per-file floor; `A6`'s
   bound is ≤ 0.30 s CPU. A new in-lane file is over the bound before it asserts anything.
   Hosting the assertion in an existing file avoids the floor but not the next point.
3. **A test file cannot see the lane's inventory from inside a worker.** With `isolate: true`
   each file runs in its own worker and vitest exposes no in-test API for "every file this run
   collected". The honest in-lane options are a second vitest instance in-process
   (`vitest/node` `createVitest` — roughly the same vite-server start the separate process pays,
   ~0.4 s CPU, over `A6`) or re-implementing the collector's glob matching against the config's
   `exclude` array, which asserts what MY matcher collects, not what vitest collects. Not
   measured further: the floor in (2) already excludes the placement.

## The limit, stated rather than smoothed

**This is a FIFTH step, not one of the four mandatory gates.** `quality.mandatory_gates` is
`["lint", "typecheck", "unit", "build"]`; a `test.exclude` edit that drops a file leaves all
four GREEN (measured: `M1` and `M2` both lint 0 / typecheck 0 / build 0) and only this step
sees it, only when it is run. That is exactly `test-skip-integrity.js`'s position: the gate
runner has to call it. **The `AGENTS.md` `## Test integrity` line that would record the command
is NAMED OWED to the Scribe under `ABC-109`'s byte cap and was not written** (ticket
`## Out of scope`, `A5`). Until it is recorded there, the instrument is discoverable from this
note, the ticket's `## Delivery`, the trace row and the file's own header comment.

Second limit: `git ls-files` reads the index. A file `git add`ed and then broken by a glob is
caught; a file deleted from disk without `git rm` is reported as tracked-but-not-collected,
which is true and is not this ticket's defect class. Third: a checkout planted somewhere the
`exclude` list already covers is invisible to this instrument AND harmless to the lane — the
instrument asserts the lane's set, not the filesystem's.

## Rejected

- **Both placements.** The ticket allows "both". A second, in-lane row asserting the config's
  `exclude` array equals twelve literal strings would catch every edit — and would be a
  recorded-count instrument of the config's VALUE, removable by the same glob, at ~370 ms.
  One instrument was asked for; one was built (`AGENTS.md` rule 5).
- **A `package.json` script or a `vitest.config.ts` `globalSetup`.** The config is never edited
  (`A5`); a script alias is unrequested flexibility and the command belongs in `AGENTS.md`.
- **A CI job or a pre-commit hook.** Refused by `ABC-050` on `ABC-028` `F4`'s measurement; the
  refusal stands and the ticket repeats it.

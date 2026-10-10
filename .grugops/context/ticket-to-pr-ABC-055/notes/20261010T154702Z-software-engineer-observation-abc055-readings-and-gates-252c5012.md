---
id: 20261010T154702Z-software-engineer-observation-abc055-readings-and-gates-252c5012
kind: observation
by: software-engineer
at: 2026-10-10T15:47:02Z
verified_by:
confidence: high
refs:
  - ABC-055
  - ADR-0036
  - plans/board.md
supersedes:
---

# `ABC-055`: premise, `A1`–`A5`, gates, clause (b)

This note is hand-authored and unsealed. Base `764454b5` (wave tip), board commit `ec5d975f`.

## Premise at `764454b5`

The premise held:
- `grep '^## ' plans/board.md` lists 11 column headings against 13 table rows. The missing two are
  exactly `In Analysis` and `In Design`.
- `.grugops/factory.config.json#wip_limits` has `In Analysis` 2 and `In Design` 2.
- Both columns have zero rows; no ticket is in flight there.

No stop condition fired.

## Checker (re-runnable)

The checker is a scratchpad script; its logic is stated here so the next reader can rebuild it:
- Take the H2 headings of `plans/board.md`, excluding `## Columns` and `## Conventions`, with the
  ` (…)` suffix stripped.
- Compare them, in order, with the first cell of the table rows under `## Columns`.
- For each heading, count the `- [` rows up to the next H2.
- Check the parenthesis against `jq -r --arg k "$name" '.wip_limits[$k]' .grugops/factory.config.json`:
  `WIP rows/limit`; `WIP unlimited` for Backlog and Done; `visible, time-tracked` for Blocked.

At base it fails: A1 11 ≠ 13. At `ec5d975f` it exits 0.

| # | verdict | reading at `ec5d975f` |
|---|---|---|
| `A1` | MET | 13 headings = 13 table rows, same names and order (`diff` empty) |
| `A2` | MET | every limited heading equals the dial: Ready 8, In Analysis 2, In Design 2, Ready for Dev 6, In Development 3, In Review 3, In Security/NFR 2, Ready for UAT 4, In UAT 4, Ready to Release 4. Backlog and Done read `(WIP unlimited)`; Blocked reads `(visible, time-tracked)` |
| `A3` | MET | each left number equals its row count. The new columns read `0` because they hold 0 `- [` rows. The others are unchanged (Backlog 26, In Development 1, Ready for UAT 1, Done 104, the rest 0) |
| `A4` | MET | `git diff --name-only 764454b5 ec5d975f` = `plans/board.md` only; numstat +14/−3. The (column, row) pairs before and after are identical, 132 of 132 (`awk` over `^## ` / `^- \[`). The 3 removed lines are all in the FORMAT comment. 0 ticket rows added or removed |
| `A5` | MET | `^+_Updated:` 1, `^-_Updated:` 0. The line is prepended at line 2, in the Orchestrator's form. Nothing is replaced, so no `history/` file is written |

## Gates (worktree, `ec5d975f`)

- `npm run lint`: exit 0. `biome check .` checked 100 files, no fixes.
- `npm test`: exit 0. 52 files / 1608 passed, 0 skipped.

## Clause (b) (`ADR-0036` § Canonical clause (b))

**UNKNOWN - verify.** The three-limb probe was not run: the session's permission classifier
denied `node .grugops/context/design-F-072-1/probe/clause-b.mjs 764454b5 ec5d975f {1,2,3}`. The
gate or the Orchestrator should run it.

The git facts the probe reads are these. `git diff --name-only 764454b5 ec5d975f -- src` is empty,
so the diff has 0 production files. On the ADR's own definition (executable code in production
files), that predicts (b1) 0 capability lines and (b2) 0 import edges, so (b) does not fire. This
is a prediction, not a probe reading.

- (a) no manifest touched.
- (c) no test file touched.
- (d) the blast radius is `plans/board.md` only.
- `N8-LANE`: 0 files.
- `NFR-002`: not triggered.

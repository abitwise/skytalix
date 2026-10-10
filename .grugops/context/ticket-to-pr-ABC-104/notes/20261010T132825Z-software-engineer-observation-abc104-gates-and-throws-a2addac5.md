---
id: 20261010T132825Z-software-engineer-observation-abc104-gates-and-throws-a2addac5
kind: observation
by: software-engineer
at: 2026-10-10T13:28:25Z
verified_by:
confidence: high
refs:
  - ABC-104
  - ABC-031
  - ADR-0004
  - N8-LANE
  - src/coordinate-move.ts
  - 20261010T132825Z-software-engineer-decision-abc104-totality-scoped-to-text-30823a98
supersedes:
---

# `ABC-104` readings: premise, gates, per criterion

This note is hand-authored and unsealed. Branch `grugops/ABC-104-coordinate-move-docblock`, from
`b7cffc52`; the code is `7707f61f`. Node v26.11.0. The probe is `../probe/probe.mts`.

## Premise, re-verified at `b7cffc52` before editing

- `src/coordinate-move.ts:30` read "It is a TOTAL function and does not throw". The file has one
  commit, `c59e1e86`.
- `parseCoordinateMove(null, "e2e4")` threw `TypeError: Cannot read properties of null (reading 'blackToMove')`.
- `parseCoordinateMove(startpos, "e2e4", 42)` threw `TypeError: (legal ?? legalMoves(...)).filter is not a function`.
- The control, `parseCoordinateMove(startpos, "e2e4")`, returned `move`. The premise holds.

## Gate on `7707f61f` (in the worktree)

| command | result |
|---|---|
| `npm run lint` | exit 0, "Checked 98 files … No fixes applied." |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **51 files, 1583 passed**, 7.33 s, load1 11.67 before the run |
| skip count | **0** (the vitest summary shows no skipped or todo count) |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |

## Per criterion

| # | verdict | reading |
|---|---|---|
| `A1` | MET | The new `:30-37` says "TOTAL OVER `text`", "Totality is over `text` ONLY", and "`position` and `legal` are a caller obligation". The words "a TOTAL function" no longer appear: `grep -n "TOTAL function" src/coordinate-move.ts` prints nothing |
| `A2` | MET | The probe was re-run after the edit, and both calls still throw the same `TypeError`s quoted above. The docblock names both calls as throwing |
| `A3` | MET | `git diff -U0 7707f61f~1 7707f61f`: one file, `src/coordinate-move.ts`, one hunk `@@ -30,3 +30,8 @@`. That hunk lies inside lines 1–33, and the base header is byte-identical to the one at `f76e041` (one commit on the file). numstat `8 3`. Every `+`/`−` line starts with ` *` (the filter for non-comment lines printed nothing). Suite green, skips 0 |

`N8-LANE`: 0 test files added, 0 executable lines changed, no measurement owed (ticket § Security / NFR).
Security is not triggered. **UAT is NOT waived:** the production-file filter lists `src/coordinate-move.ts`
even for a comment-only diff, as the ticket's § Size and priority states. The owner's word is needed at `In UAT`.
